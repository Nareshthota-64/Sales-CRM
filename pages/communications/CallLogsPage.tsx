import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: The 'LiveSession' type is not exported from '@google/genai'.
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import PhoneCallIcon from '../../components/icons/PhoneCallIcon';
import ClockIcon from '../../components/icons/ClockIcon';
import SmileIcon from '../../components/icons/SmileIcon';
import PhoneIncomingIcon from '../../components/icons/PhoneIncomingIcon';
import PhoneOutgoingIcon from '../../components/icons/PhoneOutgoingIcon';
import ZapIcon from '../../components/icons/ZapIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import PhoneIcon from '../../components/icons/PhoneIcon';
import { teamMembersData, TeamMember } from '../../components/data/team';
import XIcon from '../../components/icons/XIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

// --- AUDIO HELPER FUNCTIONS ---

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- TYPES & MOCK DATA ---
interface CallLog {
    id: number;
    type: 'incoming' | 'outgoing' | 'missed';
    contact: string;
    company: string;
    duration: string;
    date: string;
    transcription?: string;
    insights?: {
        summary: string;
        actionItems: string[];
        sentiment: string;
    } | null;
}

const initialCallLogs: CallLog[] = [
    { 
        id: 1, 
        type: 'incoming', 
        contact: 'John Doe', 
        company: 'Innovatech', 
        duration: '5m 32s', 
        date: '2024-07-15 10:15 AM',
        transcription: `[00:02] You: Hi John, Amélie here from BDE AI.\n[00:05] John: Hi Amélie, thanks for calling back.\n[00:08] You: Of course. I wanted to follow up on our email exchange and see if you had any more thoughts on the demo.\n[00:15] John: Yes, the team was very impressed, especially with the AI-powered lead scoring. We're currently using a manual process and it's a huge time sink.\n[00:25] You: I'm glad to hear that. That's one of the biggest value propositions for our clients. It frees up BDEs to focus on selling rather than just researching.\n[00:35] John: Exactly. My main question now is around integration with our existing CRM, Salesforce. How seamless is that process?\n...`,
        insights: {
            summary: "John at Innovatech is a highly qualified lead. His team was impressed with the AI lead scoring feature and their main concern is a seamless Salesforce integration. He expressed a clear need to automate their manual processes.",
            actionItems: ["Send Salesforce integration documentation", "Schedule a follow-up call with a technical specialist", "Prepare a quote for the Enterprise plan for 20 users"],
            sentiment: "Positive"
        }
    },
    { id: 2, type: 'outgoing', contact: 'Jane Smith', company: 'Solutions Inc.', duration: '12m 10s', date: '2024-07-14 02:45 PM' },
    { id: 3, type: 'incoming', contact: 'Sam Wilson', company: 'DataCorp', duration: '8m 05s', date: '2024-07-14 11:00 AM' },
    { id: 4, type: 'missed', contact: 'Patricia Williams', company: 'FutureGadget', duration: '0m 0s', date: '2024-07-13 09:20 AM' },
];

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string; delay: number }> = ({ title, value, icon, color, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex justify-between items-center">
            <p className="text-slate-500 font-medium">{title}</p>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

const CallLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<CallLog[]>(initialCallLogs);
    const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [isContactSelectionModalOpen, setIsContactSelectionModalOpen] = useState(false);
    
    const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
    const [selectedContactForCall, setSelectedContactForCall] = useState<TeamMember | null>(null);

    const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended' | 'analyzing'>('idle');
    const [callDuration, setCallDuration] = useState(0);
    const [liveTranscription, setLiveTranscription] = useState('');

    const timerRef = useRef<number | null>(null);
    // FIX: Replaced 'LiveSession' with 'any' as it is not an exported type.
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorNodeRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextAudioTimeRef = useRef(0);
    const fullTranscriptionRef = useRef('');

    const cleanupAudio = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        scriptProcessorNodeRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        scriptProcessorNodeRef.current = null;
        mediaStreamSourceRef.current = null;
        mediaStreamRef.current = null;
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;
        sessionPromiseRef.current = null;
        fullTranscriptionRef.current = '';
        setLiveTranscription('');
        nextAudioTimeRef.current = 0;
        audioSourcesRef.current.clear();
    }, []);

    const generateCallInsights = async (transcription: string) => {
        if (!transcription.trim()) return null;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Based on this call transcription with a colleague, provide a JSON object with:\n1. A 'summary' of the conversation.\n2. An array of 'actionItems' for 'Amélie Laurent'.\n3. A 'sentiment' analysis ('Positive', 'Neutral', or 'Negative').\n\nTranscription:\n---\n${transcription}\n---\n\nRespond ONLY with the JSON object.`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json" } });
            
            return JSON.parse(response.text);
        } catch (error) {
            console.error("Failed to generate call insights:", error);
            return null;
        }
    };
    
    useEffect(() => {
        if (callStatus === 'active') {
            timerRef.current = window.setInterval(() => setCallDuration(prev => prev + 1), 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callStatus]);
    
    const handleViewInsights = (call: CallLog) => {
        setSelectedCall(call);
        setIsInsightModalOpen(true);
    };

    const handleOpenContactSelection = () => {
        setIsContactSelectionModalOpen(true);
    };

    const startCallWithContact = async (contact: TeamMember) => {
        setIsContactSelectionModalOpen(false);
        setSelectedContactForCall(contact);
        setCallDuration(0);
        setLiveTranscription('');
        fullTranscriptionRef.current = '';
        setCallStatus('connecting');
        setIsCallModalOpen(true);

        try {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // FIX: Cast window to `any` to allow access to the vendor-prefixed webkitAudioContext,
            // which is necessary for older browser compatibility but may not be in standard TS types.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setCallStatus('active');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(mediaStreamRef.current!);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorNodeRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setLiveTranscription(prev => prev + text);
                            fullTranscriptionRef.current += text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            setLiveTranscription(prev => prev + text);
                            fullTranscriptionRef.current += text;
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            const outputCtx = outputAudioContextRef.current!;
                            nextAudioTimeRef.current = Math.max(nextAudioTimeRef.current, outputCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
                            
                            const source = outputCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputCtx.destination);
                            source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                            
                            source.start(nextAudioTimeRef.current);
                            nextAudioTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        handleEndCall(true);
                    },
                    onclose: (e: CloseEvent) => {
                        // This might be called naturally, so the main end call logic is in the button handler
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `You are ${contact.name}, my colleague. We are having a quick voice chat. Keep your responses conversational and brief, acting as that person.`
                },
            });
        } catch (err) {
            console.error('Failed to start call:', err);
            alert('Could not access microphone. Please check permissions.');
            setIsCallModalOpen(false);
            setCallStatus('idle');
        }
    };

    const handleEndCall = async (errorOccurred = false) => {
        if (callStatus === 'analyzing' || callStatus === 'ended' || callStatus === 'idle') return;
        
        sessionPromiseRef.current?.then(session => session.close());
        
        if (errorOccurred || callDuration < 2) { // Don't save very short/error calls
            setCallStatus('ended');
            setTimeout(() => {
                setIsCallModalOpen(false);
                setCallStatus('idle');
                cleanupAudio();
            }, 1000);
            return;
        }

        setCallStatus('analyzing');
        const insights = await generateCallInsights(fullTranscriptionRef.current);

        const newLog: CallLog = {
            id: logs.length + 1,
            type: 'outgoing',
            contact: selectedContactForCall!.name,
            company: 'Internal',
            duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
            date: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }),
            transcription: fullTranscriptionRef.current,
            insights: insights
        };

        setLogs(prev => [newLog, ...prev]);
        setCallStatus('ended');
        
        setTimeout(() => {
            setIsCallModalOpen(false);
            setCallStatus('idle');
            cleanupAudio();
        }, 1500);
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const getTypeIcon = (type: string) => {
        if (type === 'incoming') return <PhoneIncomingIcon className="w-5 h-5 text-green-600" />;
        if (type === 'outgoing') return <PhoneOutgoingIcon className="w-5 h-5 text-blue-600" />;
        return <PhoneCallIcon className="w-5 h-5 text-red-600" />;
    };

    const currentUser = { name: 'Amélie Laurent' }; // Assuming for now

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Call Logs</h1>
                    <p className="text-slate-500 mt-1">Track and analyze all your voice communications with AI-powered insights.</p>
                </div>
                <Button onClick={handleOpenContactSelection} leftIcon={<PhoneIcon className="w-4 h-4" />}>
                    Start New Call
                </Button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="Total Calls Today" value="14" icon={<PhoneCallIcon className="w-5 h-5 text-blue-600" />} color="bg-blue-100" delay={100} />
                <KpiCard title="Average Duration" value="6m 45s" icon={<ClockIcon className="w-5 h-5 text-yellow-600" />} color="bg-yellow-100" delay={200} />
                <KpiCard title="Positive Sentiment" value="82%" icon={<SmileIcon className="w-5 h-5 text-green-600" />} color="bg-green-100" delay={300} />
            </section>
            
            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Duration</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3 text-center">AI Insights</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((call, index) => (
                                <tr key={call.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors animate-fade-in" style={{ animationDelay: `${500 + index * 50}ms` }}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(call.type)}
                                            <span className="font-medium text-slate-700 capitalize">{call.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-bold text-slate-800">{call.contact}</p>
                                        <p className="text-slate-500">{call.company}</p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{call.duration}</td>
                                    <td className="px-4 py-3 text-slate-500">{call.date}</td>
                                    <td className="px-4 py-3 text-center">
                                        {call.insights ? (
                                        <Button size="sm" variant="secondary" onClick={() => handleViewInsights(call)} leftIcon={<ZapIcon className="w-4 h-4" />}>
                                            View Analysis
                                        </Button>
                                        ) : (
                                        <span className="text-xs text-slate-400">Not Available</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <Modal isOpen={isInsightModalOpen} onClose={() => setIsInsightModalOpen(false)}>
                <div className="p-2 max-w-3xl w-full">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Call Analysis for {selectedCall?.contact}</h2>
                    <p className="text-slate-500 mb-6">Generated by Sales CRM</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Transcription */}
                        <div className="space-y-4">
                             <h3 className="font-semibold text-slate-800">Call Transcription</h3>
                             <div className="bg-slate-50 p-4 rounded-lg h-80 overflow-y-auto text-sm whitespace-pre-wrap font-mono text-slate-700">
                                {selectedCall?.transcription || "No transcription available."}
                             </div>
                        </div>
                        {/* AI Insights */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-indigo-500" />AI Key Insights</h3>
                            {selectedCall?.insights ? (
                                <>
                                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-indigo-800">Summary</h4>
                                    <p className="text-sm text-indigo-700">{selectedCall.insights.summary}</p>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-green-800">Action Items</h4>
                                    <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                                        {selectedCall.insights.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                    <h4 className="font-bold text-yellow-800">Sentiment Analysis</h4>
                                    <p className="text-sm text-yellow-700">{selectedCall.insights.sentiment}</p>
                                </div>
                                </>
                            ) : <p className="text-sm text-slate-500">No insights available for this call.</p>}
                        </div>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isContactSelectionModalOpen} onClose={() => setIsContactSelectionModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Who would you like to call?</h2>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {teamMembersData.filter(m => m.name !== currentUser.name).map(member => (
                            <button key={member.id} onClick={() => startCallWithContact(member)} className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors text-left">
                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="font-semibold text-slate-800">{member.name}</p>
                                    <p className="text-sm text-slate-500">{member.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isCallModalOpen} onClose={() => handleEndCall()}>
                 <div className="p-4 w-full max-w-md">
                    <div className="text-center p-4">
                        <img src={selectedContactForCall?.avatar} alt={selectedContactForCall?.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
                        <h3 className="text-2xl font-bold text-slate-800">{selectedContactForCall?.name}</h3>
                        <p className="text-slate-500 mb-4">Internal Call</p>
                        
                        {callStatus === 'connecting' && <p className="mt-4 text-lg font-semibold text-slate-600 animate-pulse">Connecting...</p>}
                        {callStatus === 'active' && <p className="mt-4 text-3xl font-bold text-slate-800 font-mono tracking-wider">{formatDuration(callDuration)}</p>}
                        {callStatus === 'analyzing' && <div className="flex flex-col items-center gap-2 mt-4 text-lg font-semibold text-indigo-600"><SpinnerIcon className="w-6 h-6"/>Analyzing call...</div>}
                        {callStatus === 'ended' && <p className="mt-4 text-lg font-semibold text-green-600">Call Ended & Logged</p>}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg h-40 overflow-y-auto text-sm text-slate-700 my-4">
                        {liveTranscription || "Waiting for transcription..."}
                    </div>

                    <Button onClick={() => handleEndCall()} className="w-full !bg-red-600 hover:!bg-red-700 !shadow-red-500/30 !focus:ring-red-500" disabled={callStatus === 'ended' || callStatus === 'analyzing'}>
                        End Call
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default CallLogsPage;
