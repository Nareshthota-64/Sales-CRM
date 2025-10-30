import React, { useState, useMemo } from 'react';
import MailIcon from '../../components/icons/MailIcon';
import SendIcon from '../../components/icons/SendIcon';
import EditIcon from '../../components/icons/EditIcon';
import ArchiveIcon from '../../components/icons/ArchiveIcon';
import Trash2Icon from '../../components/icons/Trash2Icon';
import ReplyIcon from '../../components/icons/ReplyIcon';
import ForwardIcon from '../../components/icons/ForwardIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import Button from '../../components/ui/Button';

// Mock Data
const emailsData = {
    inbox: [
        { id: 'inbox-1', from: 'John Doe', subject: 'Re: Following up from Innovatech', body: 'Hi Amélie, Thanks for the follow-up. We are very interested. Could we schedule a demo for next week?', date: '2 hours ago', read: false },
        { id: 'inbox-2', from: 'Marketing Team', subject: 'New Webinar Leads Available', body: 'Hi team, 50 new leads from the "AI in Sales" webinar have been added to the system. Please review and assign.', date: '8 hours ago', read: false },
        { id: 'inbox-3', from: 'Jane Smith', subject: 'Question about your services', body: 'Hello, I was on your website and had a question about the enterprise pricing. Can someone get in touch?', date: '1 day ago', read: true },
        { id: 'inbox-4', from: 'Benoît Dubois', subject: 'Q3 Sales Strategy', body: 'Team, please find the attached document for our Q3 strategy. Review before our meeting on Friday. Thanks!', date: '2 days ago', read: true },
    ],
    sent: [
        { id: 'sent-1', to: 'John Doe', subject: 'Following up from Innovatech', body: 'Hi John, Just following up on our conversation from last week. Let me know if you have any questions.', date: '4 hours ago', read: true },
    ],
    templates: [
        { id: 'temp-1', name: 'Initial Outreach', subject: 'Introduction from BDE AI System', body: 'Hi [Name],\n\nMy name is Amélie and I\'m with BDE AI System. I came across your company and was impressed by [something specific].\n\nI believe our solution could help [Company Name] with [specific pain point].\n\nWould you be open to a brief 15-minute call next week to explore this further?\n\nBest,\nAmélie' },
        { id: 'temp-2', name: 'Post-Demo Follow-Up', subject: 'Following our demo', body: 'Hi [Name],\n\nThanks for your time today. I hope you found the demo insightful.\n\nAs promised, I\'ve attached some additional information on the features we discussed.\n\nLet me know if you have any questions.\n\nBest,\nAmélie' },
    ],
};

type Folder = 'inbox' | 'sent' | 'templates';

const EmailCenterPage: React.FC = () => {
    const [activeFolder, setActiveFolder] = useState<Folder>('inbox');
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>('inbox-1');

    const activeEmails = emailsData[activeFolder];
    const selectedEmail = useMemo(() => {
        if (activeFolder === 'templates' || !selectedEmailId) return null;
        return (emailsData[activeFolder] as typeof emailsData.inbox | typeof emailsData.sent).find(e => e.id === selectedEmailId);
    }, [activeFolder, selectedEmailId]);
    
    const selectedTemplate = useMemo(() => {
        if (activeFolder !== 'templates' || !selectedEmailId) return null;
        return emailsData.templates.find(t => t.id === selectedEmailId);
    }, [activeFolder, selectedEmailId]);

    const FolderItem: React.FC<{ name: string; icon: React.ReactNode; count: number; folderId: Folder }> = ({ name, icon, count, folderId }) => (
        <button 
            onClick={() => { setActiveFolder(folderId); setSelectedEmailId(null); }}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${activeFolder === folderId ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{name}</span>
            </div>
            {count > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-indigo-200 text-indigo-800 rounded-full">{count}</span>}
        </button>
    );

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <header className="animate-fade-in mb-6">
                <h1 className="text-4xl font-bold text-slate-800">Email Center</h1>
                <p className="text-slate-500 mt-1">Unified email management with AI-powered assistance.</p>
            </header>

            <div className="flex-grow bg-white rounded-2xl shadow-sm flex overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
                {/* Folders Panel */}
                <div className="w-64 border-r border-slate-200 p-4">
                    <Button className="w-full mb-6">New Message</Button>
                    <div className="space-y-1">
                        <FolderItem name="Inbox" icon={<MailIcon className="w-5 h-5" />} count={emailsData.inbox.filter(e => !e.read).length} folderId="inbox" />
                        <FolderItem name="Sent" icon={<SendIcon className="w-5 h-5" />} count={0} folderId="sent" />
                        <FolderItem name="Templates" icon={<EditIcon className="w-5 h-5" />} count={0} folderId="templates" />
                    </div>
                </div>

                {/* Email List Panel */}
                <div className="w-96 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 capitalize">{activeFolder}</h2>
                    </div>
                    <div className="overflow-y-auto">
                        {activeEmails.map((item, index) => (
                            <button key={item.id} onClick={() => setSelectedEmailId(item.id)} className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 ${selectedEmailId === item.id ? 'bg-indigo-50' : ''}`}>
                                {/* FIX: Use 'in' operator for type guarding to safely access properties on the union type. */}
                                <p className="font-bold text-slate-800">{'name' in item ? item.name : 'from' in item ? item.from : item.to}</p>
                                <p className={`font-semibold ${selectedEmailId === item.id ? 'text-slate-700' : 'text-slate-600'}`}>{item.subject}</p>
                                <p className="text-sm text-slate-500 truncate">{item.body.split('\n')[0]}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Email Detail Panel */}
                <div className="flex-1 flex flex-col">
                    {(selectedEmail || selectedTemplate) ? (
                        <>
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800">{selectedEmail?.subject || selectedTemplate?.name}</h3>
                                <div className="flex items-center gap-2">
                                    {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                    <Button size="sm" variant="secondary" leftIcon={<SparklesIcon className="w-4 h-4"/>}>Summarize</Button>
                                    {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                    <Button size="sm" variant="secondary" leftIcon={<SparklesIcon className="w-4 h-4"/>}>Suggest Reply</Button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-grow">
                                {selectedEmail && (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            {/* FIX: Use 'in' operator for type guarding and display 'To:' for sent items. */}
                                            <p className="font-semibold text-slate-800">
                                                {'from' in selectedEmail ? `From: ${selectedEmail.from}` : `To: ${selectedEmail.to}`}
                                            </p>
                                            <p className="text-sm text-slate-500">{selectedEmail.date}</p>
                                        </div>
                                        <div className="whitespace-pre-wrap text-slate-700">
                                            {selectedEmail.body}
                                        </div>
                                    </>
                                )}
                                {selectedTemplate && (
                                     <div className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-4 rounded-lg">
                                        <p className="font-semibold text-slate-800 mb-2">Subject: {selectedTemplate.subject}</p>
                                        {selectedTemplate.body}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-slate-200 flex items-center gap-2">
                                {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                <Button size="sm" variant="secondary" leftIcon={<ReplyIcon className="w-4 h-4"/>}>Reply</Button>
                                {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                <Button size="sm" variant="secondary" leftIcon={<ForwardIcon className="w-4 h-4"/>}>Forward</Button>
                                <div className="flex-grow" />
                                {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                <Button size="sm" variant="secondary" leftIcon={<ArchiveIcon className="w-4 h-4"/>}>Archive</Button>
                                {/* FIX: Set button size to 'sm' for a more compact UI in the action bar. */}
                                <Button size="sm" variant="secondary" className="!text-red-600 hover:!bg-red-50" leftIcon={<Trash2Icon className="w-4 h-4"/>}>Delete</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div>
                                <p className="font-semibold text-slate-600">Select an item to read</p>
                                <p className="text-sm text-slate-500">Nothing is selected</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailCenterPage;
