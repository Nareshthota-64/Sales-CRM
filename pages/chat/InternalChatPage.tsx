import React, { useState, useRef, useEffect } from 'react';
import HashIcon from '../../components/icons/HashIcon';
import PaperclipIcon from '../../components/icons/PaperclipIcon';
import SendIcon from '../../components/icons/SendIcon';

// Mock Data
const userData = { name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', status: 'Online' };
const channels = ['general', 'sales-team', 'random', 'q3-planning'];
const directMessages = [
    { name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', status: 'Online' },
    { name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', status: 'Offline' },
    { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', status: 'Online' },
];

const initialConversations = {
    general: [
        { user: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Morning team! Quick reminder about the Q3 strategy meeting at 2 PM today.', time: '9:01 AM' },
        { user: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', text: 'Got it, thanks Benoît!', time: '9:02 AM' },
        { user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'I\'ve added my presentation slides to the shared drive. Looking forward to it!', time: '9:05 AM' },
    ],
    'sales-team': [
        { user: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', text: 'Just closed a new deal with NextGen AI! 🎉', time: '11:30 AM' },
        { user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Awesome work, David! Congrats!', time: '11:31 AM' },
    ],
    'Benoît Dubois': [
        { user: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Hey, do you have a moment to review the Innovatech proposal?', time: 'Yesterday' },
        { user: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Sure, send it over. I\'ll take a look this afternoon.', time: 'Yesterday' },
    ],
    'random': [],
    'q3-planning': [],
    'Chloé Martin': [],
    'David Garcia': [],
};

const InternalChatPage: React.FC = () => {
    const [conversations, setConversations] = useState(initialConversations);
    const [activeConversation, setActiveConversation] = useState('general');
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentMessages = conversations[activeConversation] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '') return;
        
        const newMessage = {
            user: userData.name,
            avatar: userData.avatar,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setConversations(prev => {
            const updatedConversation = [...(prev[activeConversation] || []), newMessage];
            return {
                ...prev,
                [activeConversation]: updatedConversation
            };
        });
        
        setMessage('');
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={userData.avatar} alt={userData.name} className="w-10 h-10 rounded-full" />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-50"></span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{userData.name}</p>
                                <p className="text-sm text-slate-500">{userData.status}</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Channels</h3>
                            <div className="space-y-1">
                                {channels.map(channel => (
                                    <button key={channel} onClick={() => setActiveConversation(channel)} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${activeConversation === channel ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-200'}`}>
                                        <HashIcon className="w-4 h-4" />
                                        {channel}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Messages</h3>
                            <div className="space-y-1">
                                {directMessages.map(dm => (
                                    <button key={dm.name} onClick={() => setActiveConversation(dm.name)} className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors ${activeConversation === dm.name ? 'bg-indigo-100 font-semibold' : 'hover:bg-slate-200'}`}>
                                        <div className="relative">
                                            <img src={dm.avatar} alt={dm.name} className="w-6 h-6 rounded-full" />
                                            <span className={`absolute bottom-0 right-0 block h-1.5 w-1.5 rounded-full border border-slate-50 ${dm.status === 'Online' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                        </div>
                                        <span className={activeConversation === dm.name ? 'text-indigo-700' : 'text-slate-600'}>{dm.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    <header className="p-4 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800">{activeConversation}</h2>
                        <p className="text-sm text-slate-500">A place for team-wide announcements and general chat.</p>
                    </header>
                    <main className="flex-1 overflow-y-auto p-6 space-y-6">
                        {currentMessages.length > 0 ? (
                            currentMessages.map((msg, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full flex-shrink-0" />
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-bold text-slate-800">{msg.user}</p>
                                            <p className="text-xs text-slate-400">{msg.time}</p>
                                        </div>
                                        <p className="text-slate-700">{msg.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 pt-16">
                                No messages in #{activeConversation} yet. Start the conversation!
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>
                    <footer className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder={`Message #${activeConversation}`} className="w-full bg-slate-100 rounded-lg py-3 pl-12 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <button type="button" className="text-slate-500 hover:text-slate-700">
                                    <PaperclipIcon className="w-5 h-5" />
                                </button>
                            </div>
                             <div className="absolute right-4 top-1/2 -translate-y-1/2">
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