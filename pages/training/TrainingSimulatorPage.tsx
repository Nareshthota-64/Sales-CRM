import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, Blob } from "@google/genai";
import Button from '../../components/ui/Button';
import MicIcon from '../../components/icons/MicIcon';
import BotIcon from '../../components/icons/BotIcon';
import UserIcon from '../../components/icons/UserIcon';
import SpinnerIcon from '../../components/icons/SpinnerIcon';

// --- Helper Functions for Audio Processing ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
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

// --- Personas ---
const personas = {
    'Skeptical CIO': {
        name: 'Alex (CIO)',
        avatar: '🤖',
        systemInstruction: "You are Alex, the skeptical Chief Information Officer of a large enterprise. You are resistant to change, focused on security, and believe your current systems are 'good enough'. Question everything the salesperson says and focus on potential risks and integration challenges."
    },
    'Eager Startup Founder': {
        name: 'Jamie (Founder)',
        avatar: '🚀',
        systemInstruction: "You are Jamie, the energetic and optimistic founder of a fast-growing startup. You are excited by new technology but have a limited budget. You are looking for solutions that can scale quickly and provide immediate value. Ask about pricing and speed of implementation."
    },
    'Budget-conscious Manager': {
        name: 'Pat (Manager)',
        avatar: '💰',
        systemInstruction: "You are Pat, a department manager with a tight budget. Your main goal is to prove ROI for any new tool. You are very price-sensitive and need to understand the concrete value and cost savings. Ask for specific numbers and case studies."
    }
};
type Persona = keyof typeof personas;

type CallState = 'setup' | 'connecting' | 'active' | 'generating_feedback' | 'feedback';
type TranscriptItem = { speaker: 'user' | 'ai'; text: string };
type Feedback = { summary: string; strengths: string[]; improvements: string[]; score: number; };

const TrainingSimulatorPage: React.FC = () => {
    const [callState, setCallState] = useState<CallState>('setup');
    const [selectedPersona, setSelectedPersona] = useState<Persona>('Skeptical CIO');
    const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    
    // Refs for real-time transcription
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    const startCall = async () => {
        try {
            setTranscript([]);
            setFeedback(null);
            setCallState('connecting');

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inputAudioContext;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            outputAudioContextRef.current = outputAudioContext;

            let nextStartTime = 0;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setCallState('active');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        mediaStreamSourceRef.current = source;
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(f => f * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscriptionRef.current.trim();
                            const fullOutput = currentOutputTranscriptionRef.current.trim();
                            
                            if (fullInput) {
                                setTranscript(prev => [...prev, { speaker: 'user', text: fullInput }]);
                            }
                            if (fullOutput) {
                                setTranscript(prev => [...prev, { speaker: 'ai', text: fullOutput }]);
                            }
                            currentInputTranscriptionRef.current = '';
                            currentOutputTranscriptionRef.current = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        endCall(true);
                    },
                    onclose: () => {
                        console.log('Session closed.');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: personas[selectedPersona].systemInstruction,
                },
            });

        } catch (error) {
            console.error('Failed to start call:', error);
            setCallState('setup');
        }
    };

    const endCall = async (errorOccurred = false) => {
        // Cleanup audio resources
        streamRef.current?.getTracks().forEach(track => track.stop());
        scriptProcessorRef.current?.disconnect();
        mediaStreamSourceRef.current?.disconnect();
        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();

        // Close session
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
        }

        if (errorOccurred) {
            setCallState('setup');
            return;
        }

        setCallState('generating_feedback');
        
        // Generate feedback
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const fullTranscript = transcript.map(t => `${t.speaker === 'user' ? 'BDE' : 'Prospect'}: ${t.text}`).join('\n');
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a sales coach. Here is a transcript of a sales call simulation between a BDE and an AI prospect. Provide feedback for the BDE.\n\nTranscript:\n${fullTranscript}\n\nYour feedback should include:\n1. A brief summary of the call.\n2. A list of 2-3 key strengths.\n3. A list of 2-3 areas for improvement.\n4. An overall performance score out of 100.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        score: { type: Type.INTEGER }
                    }
                }
            }
        });
        
        try {
            const feedbackData = JSON.parse(response.text);
            setFeedback(feedbackData);
        } catch (e) {
            console.error("Failed to parse feedback JSON", e);
            setFeedback({ summary: "Error generating feedback.", strengths: [], improvements: [], score: 0 });
        }

        setCallState('feedback');
    };

    const renderContent = () => {
        switch (callState) {
            case 'setup':
                return (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm text-center">
                        <h2 className="text-2xl font-bold text-slate-800">Setup Your Call</h2>
                        <p className="text-slate-500 mt-2 mb-6">Choose an AI persona to practice with.</p>
                        <select value={selectedPersona} onChange={e => setSelectedPersona(e.target.value as Persona)} className="w-full p-3 bg-slate-100 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500">
                            {Object.keys(personas).map(key => <option key={key} value={key}>{key}</option>)}
                        </select>
                        <Button onClick={startCall} className="w-full" leftIcon={<MicIcon className="w-5 h-5" />}>Start Simulation</Button>
                    </div>
                );
            case 'connecting':
                 return (
                    <div className="text-center p-8">
                        <SpinnerIcon className="w-12 h-12 text-indigo-500 mx-auto" />
                        <p className="text-xl font-semibold text-slate-700 mt-4">Connecting to AI Prospect...</p>
                    </div>
                 );
            case 'active':
                return (
                    <div className="bg-white p-6 rounded-2xl shadow-sm h-[60vh] flex flex-col">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Live Call with {personas[selectedPersona].name}</h2>
                        <div className="flex-1 bg-slate-50 rounded-lg p-4 space-y-4 overflow-y-auto">
                           {transcript.map((item, index) => (
                               <div key={index} className={`flex items-start gap-3 ${item.speaker === 'user' ? 'justify-end' : ''}`}>
                                   {item.speaker === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 flex-shrink-0">{personas[selectedPersona].avatar}</div>}
                                   <div className={`p-3 rounded-lg max-w-lg ${item.speaker === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                       {item.text}
                                   </div>
                               </div>
                           ))}
                        </div>
                        <Button onClick={() => endCall()} className="w-full mt-4 !bg-red-600 hover:!bg-red-700">End Call</Button>
                    </div>
                );
             case 'generating_feedback':
                return (
                    <div className="text-center p-8">
                        <SpinnerIcon className="w-12 h-12 text-indigo-500 mx-auto" />
                        <p className="text-xl font-semibold text-slate-700 mt-4">AI coach is analyzing your call...</p>
                    </div>
                );
            case 'feedback':
                 return feedback && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">Call Feedback</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                            <div className="bg-indigo-50 p-6 rounded-xl">
                                <p className="text-sm font-semibold text-indigo-700">Overall Score</p>
                                <p className="text-5xl font-bold text-indigo-600">{feedback.score}<span className="text-2xl">/100</span></p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl md:col-span-2">
                                <h4 className="font-bold text-green-800 mb-2">Summary</h4>
                                <p className="text-sm text-green-900">{feedback.summary}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-4 rounded-xl">
                                <h4 className="font-bold text-green-800 mb-2">What Went Well 👍</h4>
                                <ul className="list-disc list-inside text-sm text-green-900 space-y-1">
                                    {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl">
                                <h4 className="font-bold text-red-800 mb-2">Areas for Improvement 👇</h4>
                                <ul className="list-disc list-inside text-sm text-red-900 space-y-1">
                                    {feedback.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                                </ul>
                            </div>
                        </div>
                        <Button onClick={() => setCallState('setup')} className="w-full mt-8">Try Another Call</Button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="space-y-8">
             <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">AI Sales Call Simulator</h1>
                <p className="text-slate-500 mt-1">Practice your pitch with an AI-powered prospect.</p>
            </header>
            <main className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default TrainingSimulatorPage;