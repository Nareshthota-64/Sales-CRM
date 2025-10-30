import React, { useState, useEffect, useRef } from 'react';
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


// Mock Data
const initialCallLogs = [
    { id: 1, type: 'incoming', contact: 'John Doe', company: 'Innovatech', duration: '5m 32s', date: '2024-07-15 10:15 AM' },
    { id: 2, type: 'outgoing', contact: 'Jane Smith', company: 'Solutions Inc.', duration: '12m 10s', date: '2024-07-14 02:45 PM' },
    { id: 3, type: 'incoming', contact: 'Sam Wilson', company: 'DataCorp', duration: '8m 05s', date: '2024-07-14 11:00 AM' },
    { id: 4, type: 'missed', contact: 'Patricia Williams', company: 'FutureGadget', duration: '0m 0s', date: '2024-07-13 09:20 AM' },
];

const mockTranscription = `
[00:02] You: Hi John, Amélie here from BDE AI.
[00:05] John: Hi Amélie, thanks for calling back.
[00:08] You: Of course. I wanted to follow up on our email exchange and see if you had any more thoughts on the demo.
[00:15] John: Yes, the team was very impressed, especially with the AI-powered lead scoring. We're currently using a manual process and it's a huge time sink.
[00:25] You: I'm glad to hear that. That's one of the biggest value propositions for our clients. It frees up BDEs to focus on selling rather than just researching.
[00:35] John: Exactly. My main question now is around integration with our existing CRM, Salesforce. How seamless is that process?
...
`;

const mockInsights = {
    summary: "John at Innovatech is a highly qualified lead. His team was impressed with the AI lead scoring feature and their main concern is a seamless Salesforce integration. He expressed a clear need to automate their manual processes.",
    actionItems: ["Send Salesforce integration documentation", "Schedule a follow-up call with a technical specialist", "Prepare a quote for the Enterprise plan for 20 users"],
    sentiment: "Positive"
};


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
    const [logs, setLogs] = useState(initialCallLogs);
    const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState<(typeof initialCallLogs)[0] | null>(null);

    const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
    const [callDuration, setCallDuration] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (callStatus === 'active') {
            timerRef.current = window.setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callStatus]);

    const handleViewInsights = (call: (typeof initialCallLogs)[0]) => {
        setSelectedCall(call);
        setIsInsightModalOpen(true);
    };
    
    const handleStartCall = () => {
        setCallDuration(0);
        setCallStatus('connecting');
        setIsCallModalOpen(true);
        setTimeout(() => {
            setCallStatus('active');
        }, 2000); // simulate connection time
    };

    const handleEndCall = () => {
        setCallStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);

        const newLog = {
            id: logs.length + 1,
            type: 'outgoing' as const,
            contact: 'Maria Rodriguez',
            company: 'Nexus Solutions',
            duration: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
            date: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }),
        };
        
        setTimeout(() => {
            setIsCallModalOpen(false);
            setCallStatus('idle');
            if (callDuration > 0) {
              setLogs(prev => [newLog, ...prev]);
            }
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

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Call Logs</h1>
                    <p className="text-slate-500 mt-1">Track and analyze all your voice communications with AI-powered insights.</p>
                </div>
                <Button onClick={handleStartCall} leftIcon={<PhoneIcon className="w-4 h-4" />}>
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
                                        <Button size="sm" variant="secondary" onClick={() => handleViewInsights(call)} leftIcon={<ZapIcon className="w-4 h-4" />}>
                                            View Analysis
                                        </Button>
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
                    <p className="text-slate-500 mb-6">Generated by BDE AI System</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Transcription */}
                        <div className="space-y-4">
                             <h3 className="font-semibold text-slate-800">Call Transcription</h3>
                             <div className="bg-slate-50 p-4 rounded-lg h-80 overflow-y-auto text-sm whitespace-pre-wrap font-mono text-slate-700">
                                {mockTranscription}
                             </div>
                        </div>
                        {/* AI Insights */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-indigo-500" />AI Key Insights</h3>
                            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-lg">
                                <h4 className="font-bold text-indigo-800">Summary</h4>
                                <p className="text-sm text-indigo-700">{mockInsights.summary}</p>
                            </div>
                             <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                                <h4 className="font-bold text-green-800">Action Items</h4>
                                <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                                    {mockInsights.actionItems.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                <h4 className="font-bold text-yellow-800">Sentiment Analysis</h4>
                                <p className="text-sm text-yellow-700">{mockInsights.sentiment}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isCallModalOpen} onClose={handleEndCall}>
                 <div className="text-center p-8">
                    <img src="https://i.pravatar.cc/150?img=10" alt="Contact" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
                    <h3 className="text-2xl font-bold text-slate-800">Maria Rodriguez</h3>
                    <p className="text-slate-500 mb-4">Nexus Solutions</p>
                    {callStatus === 'connecting' && <p className="mt-4 text-lg font-semibold text-slate-600 animate-pulse">Connecting...</p>}
                    {callStatus === 'active' && <p className="mt-4 text-3xl font-bold text-slate-800 font-mono tracking-wider">{formatDuration(callDuration)}</p>}
                    {callStatus === 'ended' && <p className="mt-4 text-lg font-semibold text-red-600">Call Ended</p>}
                    <Button onClick={handleEndCall} className="mt-8 !bg-red-600 hover:!bg-red-700 !shadow-red-500/30 !focus:ring-red-500" disabled={callStatus === 'ended'}>
                        End Call
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

// Dummy SmileIcon if not present
const SmileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);


export default CallLogsPage;