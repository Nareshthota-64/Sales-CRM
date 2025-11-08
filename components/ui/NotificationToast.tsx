import React, { useEffect, useState } from 'react';
import { Meeting } from '../data/meetingsDB';
import XIcon from '../icons/XIcon';
import Button from './Button';
import CalendarDaysIcon from '../icons/CalendarDaysIcon';

interface NotificationToastProps {
    meeting: Meeting;
    onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ meeting, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in
        const showTimer = setTimeout(() => setIsVisible(true), 100);
        // Auto dismiss after 15 seconds
        const dismissTimer = setTimeout(() => handleDismiss(), 15000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(dismissTimer);
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Wait for fade out animation before calling onDismiss
        setTimeout(() => onDismiss(meeting.id), 300);
    };
    
    const formatTime = (date: Date) => new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <div 
            className={`w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 transform transition-all duration-300 ease-out
                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`
            }
        >
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <CalendarDaysIcon className="w-6 h-6 text-indigo-500" />
                    </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">Meeting Starting Soon!</p>
                    <p className="mt-1 text-sm text-slate-600 truncate">{meeting.title}</p>
                    <p className="text-xs text-slate-500">at {formatTime(meeting.start)}</p>
                    {meeting.link && (
                        <div className="mt-3">
                            <Button size="sm" onClick={() => window.open(meeting.link, '_blank')}>Join Meeting</Button>
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={handleDismiss} className="p-1 rounded-md inline-flex text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;