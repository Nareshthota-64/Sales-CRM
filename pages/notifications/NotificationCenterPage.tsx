import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ZapIcon from '../../components/icons/ZapIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import CheckCheckIcon from '../../components/icons/CheckCheckIcon';
import BotIcon from '../../components/icons/BotIcon';
import XIcon from '../../components/icons/XIcon';
import BriefcaseIcon from '../../components/icons/BriefcaseIcon';

type NotificationType = 'new_lead' | 'chat_mention' | 'conversion_approved' | 'ai_insight' | 'career_update';

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    time: string;
    read: boolean;
    link: string;
    dismissing?: boolean;
}

const initialNotifications: Notification[] = [
    { id: '6', type: 'career_update', title: 'Job Change: John Doe', description: 'John Doe has started a new position at Apex Innovations.', time: '2h ago', read: false, link: '/bde/leads/lead-1' },
    { id: '1', type: 'new_lead', title: 'New Hot Lead Assigned', description: 'John Doe from Innovatech looks like a great fit.', time: '2m ago', read: false, link: '/bde/leads/lead-1' },
    { id: '2', type: 'chat_mention', title: 'Mention in #sales-team', description: 'David Garcia mentioned you: "@Amélie can you check these numbers?"', time: '15m ago', read: false, link: '/chat' },
    { id: '3', type: 'conversion_approved', title: 'Conversion Approved!', description: 'Your request to convert Quantum Leap has been approved by management.', time: '1h ago', read: false, link: '/bde/companies/comp-2' },
    { id: '7', type: 'career_update', title: 'Hiring Signal: DataCorp', description: 'DataCorp is hiring for 5 new Data Scientists.', time: '1d ago', read: true, link: '/bde/leads/lead-3' },
    { id: '4', type: 'ai_insight', title: 'New AI Insight', description: 'AI suggests an upsell opportunity for DataCorp based on recent usage.', time: '3h ago', read: true, link: '/bde/companies/comp-3' },
    { id: '5', type: 'new_lead', title: 'New Lead Assigned', description: 'Jane Smith from Solutions Inc. has been assigned to you.', time: '1d ago', read: true, link: '/bde/leads/lead-2' },
];

const notificationIcons: Record<NotificationType, React.ReactNode> = {
    new_lead: <ZapIcon className="w-5 h-5 text-indigo-500" />,
    chat_mention: <MessageSquareIcon className="w-5 h-5 text-blue-500" />,
    conversion_approved: <CheckCheckIcon className="w-5 h-5 text-green-500" />,
    ai_insight: <BotIcon className="w-5 h-5 text-purple-500" />,
    career_update: <BriefcaseIcon className="w-5 h-5 text-slate-700" />,
};

const NotificationItem: React.FC<{ notification: Notification; onDismiss: (id: string) => void; onMarkAsRead: (id: string) => void; index: number }> = ({ notification, onDismiss, onMarkAsRead, index }) => {
    return (
        <div
            className={`
                relative flex items-start gap-4 p-4 rounded-lg transition-all duration-300
                ${notification.read ? 'bg-slate-50/70' : 'bg-indigo-50'}
                ${notification.dismissing ? 'opacity-0 -translate-x-8' : 'opacity-100 translate-x-0'}
                animate-fade-in
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {!notification.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm ml-4">
                {notificationIcons[notification.type]}
            </div>
            <div className="flex-grow">
                <Link to={notification.link} onClick={() => onMarkAsRead(notification.id)} className="focus:outline-none">
                    <p className="font-bold text-slate-800 hover:underline">{notification.title}</p>
                    <p className="text-sm text-slate-600">{notification.description}</p>
                </Link>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400 mb-2">{notification.time}</p>
                <button onClick={() => onDismiss(notification.id)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


const NotificationCenterPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = useMemo(() => {
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        return notifications;
    }, [notifications, filter]);

    const handleDismiss = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissing: true } : n));
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 300);
    };
    
    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Notifications</h1>
                <p className="text-slate-500 mt-1">All your alerts and updates in one place.</p>
            </header>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-4">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>All</button>
                    <button onClick={() => setFilter('unread')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>Unread</button>
                </div>
                
                <div className="space-y-3">
                    {filteredNotifications.map((n, index) => (
                       <NotificationItem 
                            key={n.id}
                            notification={n}
                            onDismiss={handleDismiss}
                            onMarkAsRead={handleMarkAsRead}
                            index={index}
                       />
                    ))}
                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p className="font-semibold">All caught up!</p>
                            <p>You have no new notifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default NotificationCenterPage;