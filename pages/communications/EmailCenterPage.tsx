import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import MailIcon from '../../components/icons/MailIcon';
import SendIcon from '../../components/icons/SendIcon';
import EditIcon from '../../components/icons/EditIcon';
import ArchiveIcon from '../../components/icons/ArchiveIcon';
import Trash2Icon from '../../components/icons/Trash2Icon';
import ReplyIcon from '../../components/icons/ReplyIcon';
import ForwardIcon from '../../components/icons/ForwardIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import TemplateIcon from '../../components/icons/TemplateIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TemplateModal from '../../components/modals/TemplateModal';

// Mock Data
const initialEmailsData = {
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
        { id: 'temp-1', name: 'Initial Outreach', subject: 'Introduction from Sales CRM', content: 'Hi [Name],\n\nMy name is Amélie and I\'m with Sales CRM. I came across your company and was impressed by [something specific].\n\nI believe our solution could help [Company Name] with [specific pain point].\n\nWould you be open to a brief 15-minute call next week to explore this further?\n\nBest,\nAmélie' },
        { id: 'temp-2', name: 'Post-Demo Follow-Up', subject: 'Following our demo', content: 'Hi [Name],\n\nThanks for your time today. I hope you found the demo insightful.\n\nAs promised, I\'ve attached some additional information on the features we discussed.\n\nLet me know if you have any questions.\n\nBest,\nAmélie' },
    ],
};

type Email = typeof initialEmailsData.inbox[0];
type SentEmail = typeof initialEmailsData.sent[0];
type Template = typeof initialEmailsData.templates[0];
type Folder = 'inbox' | 'sent' | 'templates';
type ViewMode = 'read' | 'compose';
type ComposeType = 'new' | 'reply' | 'forward';

const EmailCenterPage: React.FC = () => {
    const [emails, setEmails] = useState(initialEmailsData);
    const [activeFolder, setActiveFolder] = useState<Folder>('inbox');
    const [selectedId, setSelectedId] = useState<string | null>('inbox-1');
    const [viewMode, setViewMode] = useState<ViewMode>('read');
    const [composeState, setComposeState] = useState({ to: '', subject: '', body: '', type: 'new' as ComposeType });
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    
    const navigate = useNavigate();

    const unreadCount = useMemo(() => emails.inbox.filter(e => !e.read).length, [emails.inbox]);
    const activeItems = emails[activeFolder];

    const selectedItem = useMemo(() => {
        return activeItems.find(item => item.id === selectedId);
    }, [activeItems, selectedId]);

    const handleSelectFolder = (folderId: Folder) => {
        setActiveFolder(folderId);
        setViewMode('read');
        const firstItem = emails[folderId][0];
        setSelectedId(firstItem ? firstItem.id : null);
    };

    const handleSelectEmail = (id: string) => {
        setSelectedId(id);
        setViewMode('read');
        if (activeFolder === 'inbox') {
            setEmails(prev => ({
                ...prev,
                inbox: prev.inbox.map(e => e.id === id ? { ...e, read: true } : e)
            }));
        }
    };
    
    const handleDelete = () => {
        if (!selectedId) return;
        const currentIndex = activeItems.findIndex(item => item.id === selectedId);
        const newItems = activeItems.filter(item => item.id !== selectedId);

        setEmails(prev => ({ ...prev, [activeFolder]: newItems }));

        if (newItems.length > 0) {
            setSelectedId(newItems[Math.max(0, currentIndex - 1)].id);
        } else {
            setSelectedId(null);
        }
    };

    const handleNewMessage = () => {
        setComposeState({ to: '', subject: '', body: '', type: 'new' });
        setViewMode('compose');
    };

    const handleReply = () => {
        const email = selectedItem as Email;
        if (!email || !('from' in email)) return;
        setComposeState({
            to: email.from,
            subject: `Re: ${email.subject}`,
            body: `\n\n--- Original Message ---\n> ${email.body.replace(/\n/g, '\n> ')}`,
            type: 'reply'
        });
        setViewMode('compose');
    };

    const handleForward = () => {
        const email = selectedItem as Email | SentEmail;
        if (!email) return;
        setComposeState({
            to: '',
            subject: `Fwd: ${email.subject}`,
            body: `\n\n--- Forwarded Message ---\n${email.body}`,
            type: 'forward'
        });
        setViewMode('compose');
    };
    
    const handleSend = () => {
        const newSentEmail = {
            id: `sent-${Date.now()}`,
            to: composeState.to,
            subject: composeState.subject,
            body: composeState.body,
            date: 'Just now',
            read: true,
        };
        setEmails(prev => ({ ...prev, sent: [newSentEmail, ...prev.sent] }));
        handleSelectFolder('sent');
        setSelectedId(newSentEmail.id);
    };

    const handleSuggestReply = async () => {
        const email = selectedItem as Email;
        if (!email || !('from' in email) || isAiLoading) return;

        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const model = 'gemini-2.5-flash';
            const prompt = `I received this email:\n\n---\nFrom: ${email.from}\nSubject: ${email.subject}\n\n${email.body}\n---\n\nDraft a professional and helpful reply.`;
            
            const response = await ai.models.generateContent({ model, contents: prompt });
            const suggestedBody = response.text;

            setComposeState({
                to: email.from,
                subject: `Re: ${email.subject}`,
                body: `${suggestedBody}\n\n--- Original Message ---\n> ${email.body.replace(/\n/g, '\n> ')}`,
                type: 'reply'
            });
            setViewMode('compose');

        } catch (error) {
            console.error("AI reply generation failed:", error);
            // In a real app, show a toast notification
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleSaveTemplate = (template: { name: string; subject: string; content: string }) => {
        const newTemplate = { ...template, id: `temp-${Date.now()}` };
        setEmails(prev => ({ ...prev, templates: [newTemplate, ...prev.templates] }));
    };

    const handleUseTemplate = (template: Template) => {
        setComposeState(prev => ({...prev, subject: template.subject, body: template.content}));
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} onSave={handleSaveTemplate} />
            <header className="animate-fade-in mb-6">
                <h1 className="text-4xl font-bold text-slate-800">Email Center</h1>
                <p className="text-slate-500 mt-1">Unified email management with AI-powered assistance.</p>
            </header>

            <div className="flex-grow bg-white rounded-2xl shadow-sm flex overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
                {/* Folders Panel */}
                <div className="w-64 border-r border-slate-200 p-4 flex flex-col">
                    <Button onClick={handleNewMessage} className="w-full mb-6">New Message</Button>
                    <nav className="space-y-1">
                        <FolderItem name="Inbox" icon={<MailIcon className="w-5 h-5" />} count={unreadCount} active={activeFolder === 'inbox'} onClick={() => handleSelectFolder('inbox')} />
                        <FolderItem name="Sent" icon={<SendIcon className="w-5 h-5" />} active={activeFolder === 'sent'} onClick={() => handleSelectFolder('sent')} />
                        <FolderItem name="Templates" icon={<EditIcon className="w-5 h-5" />} active={activeFolder === 'templates'} onClick={() => handleSelectFolder('templates')} />
                    </nav>
                    <div className="mt-auto">
                        <Button variant='secondary' onClick={() => setIsTemplateModalOpen(true)} className="w-full" leftIcon={<PlusIcon className="w-4 h-4" />}>New Template</Button>
                    </div>
                </div>

                {/* Email List Panel */}
                <div className="w-96 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 capitalize">{activeFolder}</h2>
                    </div>
                    <div className="overflow-y-auto">
                        {activeItems.map(item => (
                            <button key={item.id} onClick={() => handleSelectEmail(item.id)} className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 relative ${selectedId === item.id ? 'bg-indigo-50' : ''}`}>
                                {activeFolder === 'inbox' && !(item as Email).read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                                <p className={`font-bold text-slate-800 ${activeFolder === 'inbox' && !(item as Email).read ? 'font-extrabold' : ''}`}>
                                    {'name' in item ? item.name : 'from' in item ? item.from : (item as SentEmail).to}
                                </p>
                                <p className={`font-semibold truncate ${selectedId === item.id ? 'text-slate-700' : 'text-slate-600'}`}>{'subject' in item ? item.subject : ''}</p>
                                <p className="text-sm text-slate-500 truncate">{'body' in item ? item.body.split('\n')[0] : (item as Template).content.split('\n')[0]}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1 flex flex-col">
                    {viewMode === 'compose' ? (
                         <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-800 capitalize">{composeState.type} Message</h3>
                                <Button onClick={() => setViewMode('read')} variant="secondary" size="sm">Discard</Button>
                            </div>
                            <div className="p-4 space-y-4">
                                <input type="text" placeholder="To" value={composeState.to} onChange={e => setComposeState(s => ({...s, to: e.target.value}))} className="w-full p-2 bg-slate-50 rounded-lg text-sm" />
                                <input type="text" placeholder="Subject" value={composeState.subject} onChange={e => setComposeState(s => ({...s, subject: e.target.value}))} className="w-full p-2 bg-slate-50 rounded-lg text-sm" />
                                <textarea value={composeState.body} onChange={e => setComposeState(s => ({...s, body: e.target.value}))} rows={12} className="w-full p-2 bg-slate-50 rounded-lg text-sm" />
                            </div>
                            <div className="p-4 border-t border-slate-200 flex items-center gap-2 mt-auto">
                                <Button onClick={handleSend} leftIcon={<SendIcon className="w-4 h-4"/>}>Send</Button>
                                <div className="relative group">
                                    <Button variant="secondary" leftIcon={<TemplateIcon className="w-4 h-4"/>}>Insert Template</Button>
                                    <div className="absolute bottom-full mb-2 w-60 bg-white shadow-lg rounded-lg border border-slate-200 p-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                        {emails.templates.map(t => <button key={t.id} onClick={() => handleUseTemplate(t)} className="w-full text-left p-2 text-sm hover:bg-slate-100 rounded">{t.name}</button>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : selectedItem ? (
                        <>
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                                {/* FIX: The error "Property 'name' does not exist on type 'never'" originates here, despite the line number being reported incorrectly. The original logic `{'subject' in selectedItem ? selectedItem.subject : selectedItem.name}` fails because 'subject' exists on all types, making the 'else' branch unreachable and `selectedItem` of type `never`. This new logic correctly checks for the unique 'name' property on templates first. */}
                                <h3 className="text-lg font-bold text-slate-800 truncate">{'name' in selectedItem ? selectedItem.name : selectedItem.subject}</h3>
                                {activeFolder !== 'templates' && (
                                <Button size="sm" variant="secondary" onClick={handleSuggestReply} isLoading={isAiLoading} leftIcon={<SparklesIcon className="w-4 h-4"/>}>Suggest Reply</Button>
                                )}
                            </div>
                            <div className="p-6 overflow-y-auto flex-grow">
                                {activeFolder !== 'templates' && (
                                    <>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="font-semibold text-slate-800">
                                                {'from' in selectedItem ? `From: ${selectedItem.from}` : `To: ${(selectedItem as SentEmail).to}`}
                                            </p>
                                            <p className="text-sm text-slate-500">{'date' in selectedItem ? selectedItem.date : ''}</p>
                                        </div>
                                        <div className="whitespace-pre-wrap text-slate-700">
                                            {'body' in selectedItem && selectedItem.body}
                                        </div>
                                    </>
                                )}
                                {activeFolder === 'templates' && (
                                     <div className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-4 rounded-lg">
                                        <p className="font-semibold text-slate-800 mb-2">Subject: {(selectedItem as Template).subject}</p>
                                        {(selectedItem as Template).content}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-slate-200 flex items-center gap-2">
                                {activeFolder !== 'templates' && (
                                <>
                                    <Button size="sm" variant="secondary" onClick={handleReply} leftIcon={<ReplyIcon className="w-4 h-4"/>}>Reply</Button>
                                    <Button size="sm" variant="secondary" onClick={handleForward} leftIcon={<ForwardIcon className="w-4 h-4"/>}>Forward</Button>
                                    <div className="flex-grow" />
                                    <Button size="sm" variant="secondary" leftIcon={<ArchiveIcon className="w-4 h-4"/>}>Archive</Button>
                                    <Button size="sm" variant="secondary" onClick={handleDelete} className="!text-red-600 hover:!bg-red-50" leftIcon={<Trash2Icon className="w-4 h-4"/>}>Delete</Button>
                                </>
                                )}
                                {activeFolder === 'templates' && (
                                    <Button size="sm" variant="secondary" onClick={() => { handleNewMessage(); handleUseTemplate(selectedItem as Template); }}>Use Template</Button>
                                )}
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

const FolderItem: React.FC<{ name: string; icon: React.ReactNode; count?: number; active: boolean; onClick: () => void }> = ({ name, icon, count, active, onClick }) => (
    <button onClick={onClick} className={`flex items-center justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
        <div className="flex items-center gap-3">
            {icon}
            <span>{name}</span>
        </div>
        {count && count > 0 && <span className="px-2 py-0.5 text-xs font-bold bg-indigo-200 text-indigo-800 rounded-full">{count}</span>}
    </button>
);


export default EmailCenterPage;