import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import HashIcon from '../../components/icons/HashIcon';
import PaperclipIcon from '../../components/icons/PaperclipIcon';
import SendIcon from '../../components/icons/SendIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';
import AtSignIcon from '../../components/icons/AtSignIcon';
import SmilePlusIcon from '../../components/icons/SmilePlusIcon';
import MessageCircleReplyIcon from '../../components/icons/MessageCircleReplyIcon';
import CornerDownRightIcon from '../../components/icons/CornerDownRightIcon';

// --- DATA & TYPES ---

interface User {
  name: string;
  avatar: string;
  status: 'Online' | 'Offline';
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  reactions?: { [emoji: string]: string[] };
  thread?: Message[];
  isSystemMessage?: boolean;
  replyingTo?: string; // name of user being replied to
}

const currentUser: User = { name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', status: 'Online' };

const channels = ['general', 'sales-team', 'random', 'q3-planning'];

const allTeamMembers: User[] = [
    { name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', status: 'Online' },
    { name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', status: 'Offline' },
    { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', status: 'Online' },
    { name: 'Elise Moreau', avatar: 'https://i.pravatar.cc/150?img=5', status: 'Offline' },
    { name: 'François Lambert', avatar: 'https://i.pravatar.cc/150?img=6', status: 'Online' },
    { name: 'Gabrielle Roy', avatar: 'https://i.pravatar.cc/150?img=7', status: 'Offline' },
    { name: 'Hugo Bernard', avatar: 'https://i.pravatar.cc/150?img=8', status: 'Online' },
];

const directMessages = allTeamMembers;

const initialConversations: { [key: string]: Message[] } = {
    general: [
        { id: 'gen1', user: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Morning team! Quick reminder about the Q3 strategy meeting at 2 PM today.', time: '9:01 AM', reactions: { '👍': ['Amélie Laurent', 'David Garcia'] } },
        { id: 'gen2', user: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', text: 'Got it, thanks Benoît!', time: '9:02 AM' },
        { id: 'gen3', user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'I\'ve added my presentation slides to the shared drive. Looking forward to it!', time: '9:05 AM', thread: [
            { id: 'gen3-1', user: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Perfect, I\'ll review them before the meeting.', time: '9:10 AM', replyingTo: 'Amélie Laurent' }
        ]},
    ],
    'sales-team': [
        { id: 'sales1', user: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', text: 'Just closed a new deal with NextGen AI! 🎉', time: '11:30 AM', reactions: { '🚀': ['Amélie Laurent', 'Benoît Dubois'], '👏': ['Chloé Martin'] } },
        { id: 'sales2', user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Awesome work, David! Congrats!', time: '11:31 AM' },
    ],
    'Benoît Dubois': [
        { id: 'dm1', user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Hey, do you have a moment to review the Innovatech proposal?', time: 'Yesterday' },
        { id: 'dm2', user: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Sure, send it over. I\'ll take a look this afternoon.', time: 'Yesterday' },
    ],
    'random': [], 'q3-planning': [], 'Chloé Martin': [], 'David Garcia': [],
    'Elise Moreau': [], 'François Lambert': [], 'Gabrielle Roy': [], 'Hugo Bernard': [],
};


// --- SUB-COMPONENTS ---

const MessageBubble: React.FC<{ msg: Message; onStartReply: (msg: Message) => void }> = ({ msg, onStartReply }) => (
    <div className="group relative flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
        <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1">
            <div className="flex items-baseline gap-2">
                <p className="font-bold text-slate-800">{msg.user}</p>
                <p className="text-xs text-slate-400">{msg.time}</p>
            </div>
            <p className={`text-slate-700 ${msg.isSystemMessage ? 'italic' : ''}`}>{msg.text}</p>
            {msg.reactions && (
                <div className="flex gap-1 mt-1">
                    {Object.entries(msg.reactions).map(([emoji, users]) => {
                        // FIX: Cast `users` to `string[]` to resolve TypeScript error where it's inferred as `unknown`.
                        const userList = users as string[];
                        return (
                            <div key={emoji} className="relative group/reaction">
                                <button className="px-2 py-0.5 bg-indigo-100/50 border border-indigo-200 rounded-full text-sm">
                                    {emoji} <span className="text-xs text-indigo-700">{userList.length}</span>
                                </button>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/reaction:opacity-100 transition-opacity pointer-events-none">
                                    {userList.join(', ')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {msg.thread && msg.thread.length > 0 && (
                <div className="mt-2">
                    {msg.thread.map(reply => (
                        <div key={reply.id} className="flex items-start gap-2">
                            <CornerDownRightIcon className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0"/>
                            <img src={reply.avatar} alt={reply.user} className="w-6 h-6 rounded-full" />
                            <div>
                                <p className="font-semibold text-slate-700 text-sm">{reply.user}</p>
                                <p className="text-slate-600 text-sm">{reply.text}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={() => onStartReply(msg)} className="text-xs font-semibold text-indigo-600 hover:underline mt-1 ml-6">Reply in thread</button>
                </div>
            )}
        </div>
        <div className="absolute top-2 right-4 flex gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 text-slate-500 hover:bg-slate-100 rounded"><SmilePlusIcon className="w-5 h-5" /></button>
            <button onClick={() => onStartReply(msg)} className="p-1 text-slate-500 hover:bg-slate-100 rounded"><MessageCircleReplyIcon className="w-5 h-5" /></button>
        </div>
    </div>
);


// --- MAIN CHAT COMPONENT ---

const InternalChatPage: React.FC = () => {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConversation, setActiveConversation] = useState('general');
    const [message, setMessage] = useState('');
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
    const location = useLocation();

    const currentMessages = useMemo(() => conversations[activeConversation] || [], [conversations, activeConversation]);

    useEffect(() => {
        if (location.state?.memberName) {
            // Check if the member exists in DMs to avoid errors
            if (directMessages.some(dm => dm.name === location.state.memberName)) {
                setActiveConversation(location.state.memberName);
            }
        }
    }, [location.state]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, replyTo]);
    
    useEffect(() => {
        // When conversation changes, clear any active reply state
        setReplyTo(null);
    }, [activeConversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '') return;
        
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            user: currentUser.name,
            avatar: currentUser.avatar,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replyingTo: replyTo ? replyTo.user : undefined,
        };
        
        setConversations(prev => {
            const newConvos = { ...prev };
            if (replyTo) {
                const parentMsg = newConvos[activeConversation].find(m => m.id === replyTo.id);
                if (parentMsg) {
                    parentMsg.thread = [...(parentMsg.thread || []), newMessage];
                }
            } else {
                newConvos[activeConversation] = [...(newConvos[activeConversation] || []), newMessage];
            }
            return newConvos;
        });
        
        setMessage('');
        if (replyTo) {
            setReplyTo(null);
        }
    };
    
    const handleAiAction = (action: 'summarize' | 'draft' | 'create_task') => {
        setIsAiMenuOpen(false);
        const lastMessage = currentMessages[currentMessages.length - 1];

        const systemMessage = (text: string) => ({
            id: `sys-${Date.now()}`, user: 'BDE-AI', avatar: 'https://media.licdn.com/dms/image/v2/D4D0BAQEQHDp3om_eug/company-logo_200_200/company-logo_200_200/0/1702105920324/highq_labs_pvt_ltd_logo?e=2147483647&v=beta&t=scIhNIvxzHNCJLSbJEfkjTHSzC42y1kqWB_Lz0UOTvM',
            text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isSystemMessage: true,
        });

        const addSystemMessage = (text: string) => {
            setConversations(prev => ({
                ...prev,
                [activeConversation]: [...(prev[activeConversation] || []), systemMessage(text)]
            }));
        };

        addSystemMessage(`✨ AI is working on: ${action.replace('_', ' ')}...`);

        setTimeout(() => {
            switch(action) {
                case 'summarize':
                    addSystemMessage('Summary: The team discussed the Q3 strategy meeting, David Garcia announced a new deal, and Amélie Laurent requested a proposal review.');
                    break;
                case 'draft':
                    if (lastMessage) {
                        setMessage(`Regarding "${lastMessage.text}", I think we should...`);
                    }
                    break;
                case 'create_task':
                    if (lastMessage) {
                        addSystemMessage(`✅ Task created: "${lastMessage.text}". This has been added to the BDE Project Pipeline.`);
                    }
                    break;
            }
        }, 1500);
    };


    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in font-sans">
            <div className="flex flex-1 overflow-hidden">
                {/* --- SIDEBAR --- */}
                <div className="w-72 bg-slate-50 border-r border-slate-200/80 flex flex-col">
                    <div className="p-4 border-b border-slate-200/80">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-50"></span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{currentUser.name}</p>
                                <p className="text-sm text-slate-500">{currentUser.status}</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Channels</h3>
                            <div className="space-y-1">
                                {channels.map(channel => (
                                    <button key={channel} onClick={() => setActiveConversation(channel)} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${activeConversation === channel ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                                        <HashIcon className="w-4 h-4" /> {channel}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Direct Messages</h3>
                            <div className="space-y-1">
                                {directMessages.map(dm => (
                                    <button key={dm.name} onClick={() => setActiveConversation(dm.name)} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${activeConversation === dm.name ? 'bg-indigo-100' : 'hover:bg-slate-200/60'}`}>
                                        <div className="relative"><img src={dm.avatar} alt={dm.name} className="w-6 h-6 rounded-full" />
                                            <span className={`absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full border border-slate-50 ${dm.status === 'Online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                        </div>
                                        <span className={activeConversation === dm.name ? 'text-indigo-700 font-semibold' : 'text-slate-600'}>{dm.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* --- MAIN CHAT AREA --- */}
                <div className="flex-1 flex flex-col bg-white">
                    <header className="p-4 border-b border-slate-200/80 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {channels.includes(activeConversation) ? `#${activeConversation}` : activeConversation}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {channels.includes(activeConversation)
                                    ? 'A place for team-wide announcements and general chat.'
                                    : 'A direct message between you and your colleague.'
                                }
                            </p>
                        </div>
                        <div className="relative w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search..." className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 space-y-2">
                        {currentMessages.length > 0 ? (
                            currentMessages.map((msg) => (
                                <MessageBubble key={msg.id} msg={msg} onStartReply={setReplyTo} />
                            ))
                        ) : (
                            <div className="text-center text-slate-500 pt-16">
                                No messages in {channels.includes(activeConversation) ? `#${activeConversation}` : activeConversation} yet. Start the conversation!
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-4 bg-white border-t border-slate-200/80">
                         {replyTo && (
                            <div className="bg-slate-100 p-2 rounded-t-lg text-sm text-slate-600 flex justify-between items-center animate-fade-in" style={{ animationDuration: '0.2s' }}>
                                <span>Replying to <span className="font-semibold">{replyTo.user}</span></span>
                                <button onClick={() => setReplyTo(null)} className="font-bold text-slate-400 hover:text-slate-600">×</button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="relative">
                            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`Message #${activeConversation}`} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSendMessage(e); e.preventDefault(); } }} rows={1} className="w-full bg-slate-100 rounded-lg py-3 pl-12 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
                                <button type="button" className="text-slate-500 hover:text-slate-700"><PaperclipIcon className="w-5 h-5" /></button>
                                <button type="button" className="text-slate-500 hover:text-slate-700"><AtSignIcon className="w-5 h-5" /></button>
                            </div>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <div className="relative">
                                    <button type="button" onClick={() => setIsAiMenuOpen(prev => !prev)} className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100">
                                        <SparklesIcon className="w-5 h-5" />
                                    </button>
                                    {isAiMenuOpen && (
                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10 p-1">
                                            <button onClick={() => handleAiAction('summarize')} className="w-full text-left text-sm p-2 rounded hover:bg-slate-100">Summarize</button>
                                            <button onClick={() => handleAiAction('draft')} className="w-full text-left text-sm p-2 rounded hover:bg-slate-100">Draft Reply</button>
                                            <button onClick={() => handleAiAction('create_task')} className="w-full text-left text-sm p-2 rounded hover:bg-slate-100">Create Task</button>
                                        </div>
                                    )}
                                </div>
                                <div className="h-5 w-px bg-slate-300"></div>
                                <button type="submit" className="text-indigo-600 hover:text-indigo-800 disabled:text-slate-400" disabled={!message.trim()}>
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default InternalChatPage;