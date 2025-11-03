import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import HandshakeIcon from '../../components/icons/HandshakeIcon';
import FileTextIcon from '../../components/icons/FileTextIcon';
import CheckSquareIcon from '../../components/icons/CheckSquareIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SendIcon from '../../components/icons/SendIcon';

// Mock Data
const dealData = {
    'comp-1': {
        companyName: 'Innovatech',
        dealName: 'Enterprise License Q3',
        value: 50000,
        stage: 'Negotiation',
        internalTeam: [
            { name: 'Amélie Laurent', role: 'BDE', avatar: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Account Executive', role: 'AE', avatar: 'https://i.pravatar.cc/150?img=8' },
        ],
        externalTeam: [
            { name: 'John Doe', role: 'VP of Engineering', avatar: 'https://i.pravatar.cc/150?img=11' },
            { name: 'Sarah Jenkins', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=12' },
        ],
        documents: [
            { name: 'Proposal_v2.pdf', type: 'Proposal' },
            { name: 'MSA_Draft.docx', type: 'Contract' },
            { name: 'SOW_Analytics.pdf', type: 'SOW' },
        ],
        actionPlan: [
            { task: 'Legal review of MSA', owner: 'Innovatech', due: '2024-07-20', done: true },
            { task: 'Final pricing approval', owner: 'BDE AI', due: '2024-07-22', done: false },
            { task: 'Security questionnaire completion', owner: 'BDE AI', due: '2024-07-25', done: false },
            { task: 'Contract Signature', owner: 'Both', due: '2024-07-30', done: false },
        ],
    },
};

const DealRoomPage: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();
    const deal = dealData[companyId] || dealData['comp-1']; // Fallback for demo
    const [chatMessage, setChatMessage] = useState('');

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-2">
                    <Link to={`/bde/companies/${companyId}`} className="hover:text-slate-800">{deal.companyName}</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">Virtual Deal Room</span>
                </div>
                <div className="flex items-center gap-4">
                    <HandshakeIcon className="w-10 h-10 text-indigo-500" />
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">{deal.dealName}</h1>
                        <p className="text-slate-500 font-semibold">Value: ${deal.value.toLocaleString()} | Stage: {deal.stage}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <main className="lg:col-span-2 space-y-8">
                    <Widget title="Mutual Action Plan" icon={<CheckSquareIcon />} delay={100}>
                        <div className="space-y-3">
                            {deal.actionPlan.map(item => (
                                <div key={item.task} className={`flex items-center justify-between p-3 rounded-lg ${item.done ? 'bg-green-50 text-slate-500' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" checked={item.done} readOnly className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                        <span className={`font-medium ${item.done ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.task}</span>
                                    </div>
                                    <div className="text-xs text-right">
                                        <p className="font-semibold">{item.owner}</p>
                                        <p>Due: {item.due}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                    <Widget title="Shared Documents" icon={<FileTextIcon />} delay={200}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {deal.documents.map(doc => (
                                <div key={doc.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FileTextIcon className="w-5 h-5 text-slate-500" />
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{doc.name}</p>
                                            <p className="text-xs text-slate-500">{doc.type}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary">Download</Button>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </main>

                {/* Sidebar */}
                <aside className="space-y-8">
                    <Widget title="Stakeholders" icon={<UsersIcon />} delay={300}>
                        <h4 className="text-sm font-bold text-slate-600 mb-2">Internal Team</h4>
                        <div className="space-y-2 mb-4">
                            {deal.internalTeam.map(p => <PersonCard key={p.name} {...p} />)}
                        </div>
                        <h4 className="text-sm font-bold text-slate-600 mb-2">External Team</h4>
                        <div className="space-y-2">
                            {deal.externalTeam.map(p => <PersonCard key={p.name} {...p} />)}
                        </div>
                    </Widget>
                     <Widget title="Internal Chat" icon={<MessageSquareIcon />} delay={400}>
                        <div className="h-48 bg-slate-50 rounded-lg p-2 text-xs text-slate-600 mb-2 overflow-y-auto">
                            <p><span className="font-semibold">AE:</span> @Amélie Can you send over the latest security doc?</p>
                            <p><span className="font-semibold">You:</span> On it.</p>
                        </div>
                        <div className="relative">
                            <input type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)} placeholder="Message team..." className="w-full bg-slate-100 rounded-lg py-2 pl-3 pr-10 text-sm" />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600"><SendIcon className="w-4 h-4" /></button>
                        </div>
                    </Widget>
                </aside>
            </div>
        </div>
    );
};

// FIX: Changed the type of the `icon` prop to be a ReactElement that accepts a className.
// This provides a more specific type that `React.cloneElement` can work with, resolving the TypeScript error.
const Widget: React.FC<{ title: string; icon: React.ReactElement<{ className?: string }>; children: React.ReactNode; delay: number }> = ({ title, icon, children, delay }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${delay}ms`}}>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            {React.cloneElement(icon, { className: 'w-5 h-5 text-slate-500' })}
            {title}
        </h2>
        {children}
    </div>
);

const PersonCard: React.FC<{ name: string; role: string; avatar: string }> = ({ name, role, avatar }) => (
    <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />
        <div>
            <p className="font-semibold text-slate-800 text-sm">{name}</p>
            <p className="text-xs text-slate-500">{role}</p>
        </div>
    </div>
);

// Minimal icons if they don't exist yet
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const MessageSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default DealRoomPage;