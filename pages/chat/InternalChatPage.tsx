import React, { useState, useRef, useEffect, useMemo } from 'react';
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
const directMessages = [
    { name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', status: 'Online' },
    { name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', status: 'Offline' },
    { name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', status: 'Online' },
];

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

    const currentMessages = useMemo(() => conversations[activeConversation] || [], [conversations, activeConversation]);

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
            id: `sys-${Date.now()}`, user: 'BDE-AI', avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALwAyAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQCB//EAEYQAAEDAwEEBgcFBAYLAAAAAAEAAgMEBREhBhITMSJBUWFxgRQjMpGhscEHFdHh8BYzQoIkNVJicvE2Q1NVVnOSk5TC0v/EABkBAQADAQEAAAAAAAAAAAAAAAACAwQBBf/EADARAAIBAwMCBAQFBQAAAAAAAAABAgMRMQQSIRNBFCIyUSNhccFCgZGx0TNSYqHh/9oADAMBAAIRAxEAPwD7iiIgCLCIDKLxvdqhb1tJT2z1TPX1PLhs6vFSjFydkV1KsKcd0nwS8srYWF0kjWNHMuOAq/W7WwMfwqCJ9VIeRAw381ww2i6X54nu0zoIObYWjBA8OrzyrLQWujt7C2lgY1x5u5k+fNWNQhnlmZTr1uYeVe/crwp9obqd6omFJCf4B0T+PvIXXS7I0bOlUSyTO7PZ+WvxVkwEwFB1H2Jx0kMy5fzOCKy22LG7RRHHW4bx+K62QQx+xExvg0BbUUbsvUIxwjzujsC8Pp4ZPbiY7xblbUXCVkR8tmt8ow6kjH+EbvyUfLsxTh2/STyQv7M5H4/FWBYwhW6NN5RWQy927WNwqov+r812Ue0NPK7hVTXU8n94aKawFxVttpaxp40QJPJ7dHBRs1gj05R9LOpr2vALHAg8iNcr2q0+kuNmO/SPM8HWzHL9dylLbdoa0bv7uYc43c1xTV7PgnGpd2fDJJF5BXpTLAiIgCIiAIiIDC8l2M+CZVQv92qLjWfc9oOXE7ssrTy/Idasp03N2RRXrxoxu89j3edoJ6yoNtsQMkrjh8o6vD8V32LZyCg9fUYnqjqXu1DT3fiuqxWantFNw4xvyu9uXGrlK4Up1ElthgppaeUpdWty/bshhMaLKKk2hERAEREAREQBERAEwiIDzgfoqIuVmZMTUUp4U/PLeRUysYCjKKkrMjKKkuSEt12fxvRLgOHP1HGjlNZPmo+622Ouj06EzfYf9CuW03CRknoNcC2VujXHr7lWpOD2yIJuLtInEWMrKuLQiIgCLBXJc6+O30MtVM7DY258T1BdSbdkRlJRTbITa28vpI20FHl1XUadHm0fieQXVs1ZWWmjG/rUv1kf8gonZGhkuFXLfK9uXvceC3q8fLl71ccBaKrVNdKP5mHTQdaXiJ/kvZDAWVlFmPQCIiAIiIAiIgCIiAIiIAiIgCIiA0VMDaiF8TuThhRVildDJLQS+0wktypvAUFeAaOvgrmDTk/HX+gs9bytVF2Iy45J5F5a7eAIOQRnKK+6JFa29rPR7G6IHWd4Z5cz8vipPZ2k9Bs9LAW4cGAu/xAR1Kru2f8ATL9aaDtdvOHcXAfQq0feVDnd9MgDuWOIOa1zTVCMV35POpNS1U5vtZL7nci8OeGMLnuwAMknqC5o7lRyScOOrgc88gJAcrNZs9BySydiLkfX08dYykfOwVD25bHnUhdSNNBSTwZRYUbc75RWw7tZK5rsZDWsJPyRRcnZHJzjBXk7Ik0WAi4SMouOuuNLb4uJWTsib2uOp8lGM2vssjwxtZjPImMge/CnGlOSvFNlM9RSg7SkkyfRaoZ4542vhka9jhkOacgrYoFqaeDKLC1zTxwNLppGsb2uOEOt2NqLlgrqaofuQ1MT3YzuteCV0pZrJxNPlGUWFrmlbDE+SR2GsGScZ0Q6bUUbb7xS3GaeGjkMjoAN/o4xnPb4KRXZRcXZkYTjNXi7mVwXiDjUEgAyW9IeWq7srD2hzS0jIPNVzjui0daucNml41vjyclvRPki5NnnGN1VTk/u3Zx8PosKuh56abEeUQs/r/tFhadRFHy/kJ+ZWyelp/27hj4Me56Pvbu6MZ6Wq8Uuv2i1WeqP/wBGr3cIpZduYmQVDoHmm0e1rSRz6iCF7L4aX+B4Ss05Wv8AELe9jXtLXt3gRgg9aqWztPD+1N2HCZiIt4eB7Pgpn7ur/wDfNR/2ov8A5UPsux0e0l4bJKZXjdy5wALjr2aLPSSUJ2fb7m6vJyq0rxtz9jvfUWWfaCnOQ+4gOYwjORjOc9XapKuuVPQBnpEnSecMY0Zc49wCgLj/AKd2odXCd8nrXVvdFt5TOq8iJ0OIXHlnBz4HOfeE6Slbntcj4iUN1kvVb/rJWfaGGMiFsMwqn44cMrC3fOcc+ztUBtbNWz7Ph1wpG08gqg1oY7eDmgFdm3o4tPQxU7d6rdUAxBvtcjn6LP2gg/ccO9qRO3PuKsoRipQaWWVaqU5Rqxb4SJKo2koadpJM8kY9qaOFxYP5sYXbJc6cWx9wjeJIGxl4LevC3ugidTmIxt4ZZjdxphUezMkqNhbjAzJLHv3R3AByqhThNXxyjRUrVabs+bptfVHRYLS7aCV94vGZGvcRDDnogA/RWOXZ60yxmN1dup8HsYAfeNVy7G1EdRs/TNjI9WCxwB5EKbc4NaXOIDRzKV6s+o0na2ENLp6ToqTV21yylUjZtl9oIaQSOdbqvRgcfYPL548irv8lStrKmG4V1ngoZGzSPmzlhzgZH68lZ7nTVdTTBlFWeiyBwJk4YfkdmCu11uUZS4byR0stjqQhzFY/g7srXPFFPFuzRte3scMhQf3Re/wDiF3/iM/FTMDZGU7WTycR7WgOk3d3eONThUSjGOJX/AFNUJymnui19bfYrP2dxR/dksu4OJxi3f68YGityqf2d/wBSy/8APPyCtJeGkB5AzoO8qzU/1pFWgstNEj5rzTslkiibNUSR6PEMZdunx5LZbrlS3KN7qZ5duEtexww5p7CFGUk1stE1TT0bp6meSQySxxtMjmk9uOXmuLZmRztpLuRHJG14a7ceMEHvXelFxk12IeIkpxi2nd2NNluFPQ369mdzt50oa1jGlz3YzyAyT1Keo7/RVVT6LvSQ1OMiKdhY4+GVE7LtB2jvpIBIlAB83LH2gwNbQU1WzozxTANeNCNCrZwjOsoPLS/Yz06lSlp3UjhN8fmWC4XKnoOG2d54kjt2NjW5c49wWmK9Uz6qKmeJo55ThrJIyM6E/RQl5juDai3Xykh9IMcIbJCOYz2e9b6G9W281lMJd6nrIJC5jJG4ycEYB8/gq+gtm7Pv8i/xT6m1u2LX7r6nbQDh3yqYNMgn4g/VEh02kmH936BF5unw182bokLCeH9o84P8bNO/1Y/BbZvTf2qFw+7al0McfDaWgZJ7efLVabv/AETbugnOgkaG57SctV1AC9erU2qLXeNjy6FHqOcW7Wk2eJXFjHOwThpOBzKqtibWwX+uqZ7fUsjq3DcOAd3Geeuit2Am6OxZYVNsWrZN9Sj1JRlfBUbi2rdtZS1zKCofT07CwuaBkkh2o15arVtHViO8siuNHJVUfD3oY4+e91kgan5K5YHYqx6+27R1dXV08s1NUtaI5omF/CAGoICvpVNz5WEY9RQcI8P1O7+Ry0V/sVLOHOoqimk5b8zCS0d2pIW7bFs11t1PDboX1Ie4ScSPBbjBA6+8Lvq7pTVNO+GmpJqt7xuiPgOa3zLgAF12GgfbrTT0cjt58bekRyyddFxzUGqluU+52NKVROi2nFrKVjb6W70H0j0ebe3c8HA3+eOWVA7FU9RR0U1LW0ksZe90m8/G7g4GM5VrwmAFSqlouNsmuVDdOM28fcpdRaLpYq2SrsAE1PJq+mPV+u7VZN7udxAo6iw1LYpMsldlzcDtBIHzVz3R2dyboVniL23RTfuUeC2v4c2l7diiWHZ6stW0wzCJaZrSWzO6gfqr1hZ3R+imFCtWlVlulku02mhp4uMPe4XNWzPgp3PbFJM4cmRjUrqWMDsVXcvaurFP2UNXZ7dJT1Nuq3PdKXdBgIxgd666qpuFwuNHHFQVEEDHOe+WXAwd1wGgJ01Csu6OxN0diulW3Tc7csyx0rVNU93CKVs3LWWaCajqLVVyzulLuJGzLXfzZwuizQ11LtBXVFVQyNbU7oDo9Wt06z+Stu6OxN0KUtQ25O2SMdHtUVu9OCo26OttV5uNXNSSvpqmQ9KMbzhg6Hd54OSttzgqNpJ6eDgSwW+N+/JJK3dc89gB1HuVpDQBjGiYCi6z3brcnVpFs6d/KQVZPWUd3Do6aWajMADhH/CcnUDwUdcqc3m50MlHQzQ8GUPlqZIjH0Rru4OCT5K2loPMJgLkau3lLknPTb1tb4Iam6W0U7h1N+gCwlo9bdKybmMlo8z+SLFpvS37tmiGCI+0CN0X3fXxjpQy4+o+XxVtp5WzwRysOWvaHBRu1NEa6y1MTdXhu+zxGq49iK8Vdkja49OA8N3hzHwK9KXn06f9v3MEPh6yS7SV/wBCyIiLKegYXktB5he1jCAxujGMIAByXpEAREQBERAEREAREQBERAEREAREQGFqqZRDTvlJ9hpK2qJ2gm3KMRNOXSO5d3NV1ZbYNnG7Ixs7GW0z5Hc3u0KLvoYPR6WOPrDRnx60XKMdkEhFWRvIBGqpFpJsO1tRQSaU9VrH2a6j6hXhVjba2OqqJtZTt9fSHeBHMt5lbNPJXcJYZi1sJbVUhmPP8lnCyojZ26i622OckcUdGUDqcpZVSi4tpmunUVSKlHDMoiKJMIiIAiIgCIiAIiIAiIgCIiAIiIAiwsoDyTjwUF/WN6IGsUH0/P5LuvFb6LSncPrXaN8eebLSGmpA5w9ZJ0nd3cs9TzzUO3cg+XYkkWUWgmYWHNa4EOGQdML0iAocrX7J37fAJttUTnHV2+Y+WVd2SCRjXscHNcMgjkexct1t0V0opKWcaHUOHNp6iFWbBcprHWGz3U4Zn1Up5DPLyPwPw0y+NHd+Jf7R50X4Sptfolj5P2Lqi8Ak4XpZj0TKIiAIiIAiIgCIiAIiIAiIgCLCIDK1zStijL3uDWtGSSvRdujJOg5kqvVtS+7VXodKfUt9uT9fBV1J7URlKyM0rXXa4GpkB9Gi9kHrVgwFqpqdlNCyJmgaMaLelOG1fNiKsERFYSCIiA84UVfbPBeKYRv6ErP3cgGrVLrGAuxk4u6IVKcakXGS4KbZr1UWmoFrvQLcaRzHXTx6x3/AKFva8PbvNOWkZGNVxXa1U11p+HUs1GrXjm0qsRVNz2WkENSx1Tbyei/rA7uw9yvajV5WTFGc9L5anMff2+peEXFb7lTXGES0kweOtvW3xC7Mqhpp2ZujJSV0zKLCLhIyiIgCIiAIsIgMosJlAF4c8NaXOIAGpyuetuEFEzenkAOPZGpKhc1t8kGBwKQHXv/ABUJTS4WSuVRLhZPdbXTXSf0SgHqs9OT9dSl7fRRUNOImAE/xO6yvdFSQ0cIjhaBjme0rowFyEOd0snYx5u8jCyiKwmEREAREQBERAYwvEkUcrHMlY17HDBa4ZBWxEFip12y74ZhVWWd0Eo/1ZOnkvFPtLW294hvdI8HlxGNxn6FW7AWuenhqIzHPEyRh5teMhW9S6tLkyPS7Xek9v7HLRXWirmg01Qx5I9nk73LtzplVHaGw0NLTuqKZr43A53Q7o+4qDhvdyowOFVyEdj+l806afpK3rJU3tqr9D6Yiqlo2irauXhzNhx2hpB+asweVBxaNMK8Zq6NqLxvFeS8hcsWb0bF5LgqzcNoKyGXhxthA7d05+ahp7vX1LSZal+P7LeiPguFEtTFcIudXdKSk0mnYD/ZByT5KKfeK2vcY7XTuA/2jsf5BerTZaIxsmkY6Rzue+7T4Kfjijibuxsaxo6mjAUeWSW+p3siEorCGv49fIaiY64Jy3z7VNhjWtDQ0ADQDsXrAWV1RSwWxgorgxgLKIukgiIgCIiA/9k=',
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
                            <h2 className="text-lg font-bold text-slate-800">#{activeConversation}</h2>
                            <p className="text-sm text-slate-500">A place for team-wide announcements and general chat.</p>
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
                            <div className="text-center text-slate-500 pt-16">No messages in #{activeConversation} yet. Start the conversation!</div>
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
