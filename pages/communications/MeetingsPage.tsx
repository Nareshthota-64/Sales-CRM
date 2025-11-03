import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import MonthView from '../../components/calendar/MonthView';
import WeekView from '../../components/calendar/WeekView';
import DayView from '../../components/calendar/DayView';
import MeetingModal from '../../components/modals/MeetingModal';
import MeetingDetailModal from '../../components/modals/MeetingDetailModal';

export interface Meeting {
    id: string;
    title: string;
    start: Date;
    end: Date;
    attendees: string[];
    agenda: string;
}

const initialMeetings: Meeting[] = [
    { id: '1', title: 'Q3 Strategy with Innovatech', start: new Date('2024-07-15T10:00:00'), end: new Date('2024-07-15T11:30:00'), attendees: ['John Doe'], agenda: 'Discuss Q3 goals.' },
    { id: '2', title: 'Demo for Solutions Inc.', start: new Date('2024-07-15T14:00:00'), end: new Date('2024-07-15T15:00:00'), attendees: ['Jane Smith'], agenda: 'Product demo.' },
    { id: '3', title: 'Team Sync', start: new Date('2024-07-18T09:00:00'), end: new Date('2024-07-18T09:30:00'), attendees: ['Sales Team'], agenda: 'Weekly check-in.' },
    { id: '4', title: 'Follow-up with DataCorp', start: new Date('2024-07-25T11:00:00'), end: new Date('2024-07-25T11:30:00'), attendees: ['Sam Wilson'], agenda: 'Follow up on proposal.' },
];

const MeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
    const [currentDate, setCurrentDate] = useState(new Date('2024-07-15')); // Fixed date for consistent demo
    const [activeView, setActiveView] = useState<'month' | 'week' | 'day'>('week');
    const [now, setNow] = useState(new Date());
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [modalDate, setModalDate] = useState<Date | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const handleOpenCreateModal = (date?: Date) => {
        setSelectedMeeting(null);
        setModalDate(date || new Date());
        setIsCreateModalOpen(true);
    };

    const handleOpenDetailModal = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setIsDetailModalOpen(true);
    };

    const handleSaveMeeting = (meetingData: Omit<Meeting, 'id'>) => {
        if (selectedMeeting) {
            // Update
            setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...meetingData, id: m.id } : m));
        } else {
            // Create
            setMeetings([...meetings, { ...meetingData, id: `meeting-${Date.now()}` }]);
        }
        setIsCreateModalOpen(false);
        setSelectedMeeting(null);
    };

    const handleDeleteMeeting = () => {
        if (selectedMeeting) {
            setMeetings(meetings.filter(m => m.id !== selectedMeeting.id));
            setIsDetailModalOpen(false);
            setSelectedMeeting(null);
        }
    };

    const handleUpdateMeetingTime = useCallback((id: string, newStart: Date, newEnd: Date) => {
        setMeetings(prevMeetings => prevMeetings.map(m => m.id === id ? { ...m, start: newStart, end: newEnd } : m));
    }, []);

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col font-sans">
            <header className="px-1 mb-6 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Meeting Scheduler</h1>
                <p className="text-slate-500 mt-1">Organize your schedule and prepare for meetings with AI assistance.</p>
            </header>
            
            <CalendarHeader 
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                activeView={activeView}
                setActiveView={setActiveView}
                onAddMeeting={() => handleOpenCreateModal()}
            />

            <main className="flex-1 overflow-y-auto bg-white rounded-b-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                {activeView === 'month' && <MonthView meetings={meetings} currentDate={currentDate} onDayClick={(day) => { setCurrentDate(day); setActiveView('day'); }} />}
                {activeView === 'week' && <WeekView meetings={meetings} currentDate={currentDate} now={now} onEventClick={handleOpenDetailModal} onNewEvent={handleOpenCreateModal} onEventDrop={handleUpdateMeetingTime} />}
                {activeView === 'day' && <DayView meetings={meetings} currentDate={currentDate} now={now} onEventClick={handleOpenDetailModal} onNewEvent={handleOpenCreateModal} onEventDrop={handleUpdateMeetingTime} />}
            </main>
            
            <MeetingModal
                isOpen={isCreateModalOpen}
                onClose={() => { setIsCreateModalOpen(false); setSelectedMeeting(null); }}
                onSave={handleSaveMeeting}
                meeting={selectedMeeting}
                initialDate={modalDate}
            />

            <MeetingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                meeting={selectedMeeting}
                onDelete={handleDeleteMeeting}
                onEdit={() => { setIsDetailModalOpen(false); setIsCreateModalOpen(true); }}
            />
        </div>
    );
};

export default MeetingsPage;