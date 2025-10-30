import React, { useState, useMemo } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import SparklesIcon from '../../components/icons/SparklesIcon';
import ChevronLeftIcon from '../../components/icons/ChevronLeftIcon';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';

// Mock Data
const meetingsData = [
    { id: 1, title: 'Q3 Strategy with Innovatech', date: '2024-07-15T10:00:00' },
    { id: 2, title: 'Demo for Solutions Inc.', date: '2024-07-15T14:00:00' },
    { id: 3, title: 'Team Sync', date: '2024-07-18T09:00:00' },
    { id: 4, title: 'Follow-up with DataCorp', date: '2024-07-25T11:00:00' },
];

const MeetingsPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date('2024-07-01')); // Fixed for demo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [meetingTitle, setMeetingTitle] = useState('');
    const [agenda, setAgenda] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => i + 1);
    const startingDay = firstDayOfMonth.getDay();

    const handleGenerateAgenda = () => {
        if (!meetingTitle) return;
        setIsGenerating(true);
        setAgenda('');
        setTimeout(() => {
            setAgenda(
`**Meeting Agenda: ${meetingTitle}**

**1. Welcome & Introductions (5 mins)**
   - Brief check-in with all attendees.

**2. Review of Previous Action Items (10 mins)**
   - Status update on key takeaways from our last discussion.

**3. Main Topic: [Insert Core Subject] (25 mins)**
   - Presentation of key points.
   - Open discussion and Q&A.
   - Alignment on goals and objectives.

**4. Next Steps & Action Items (10 mins)**
   - Define clear, actionable next steps.
   - Assign owners and deadlines.

**5. Wrap-up (5 mins)**
   - Summarize key decisions.
   - Confirm date for next meeting.`
            );
            setIsGenerating(false);
        }, 1500);
    };

    const changeMonth = (delta: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Meeting Scheduler</h1>
                    <p className="text-slate-500 mt-1">Organize your schedule and prepare for meetings with AI assistance.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>Schedule Meeting</Button>
            </header>

            <main className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h2 className="text-xl font-bold text-slate-800">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-5 h-5" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold text-slate-500 text-sm py-2">{day}</div>
                    ))}
                    {Array.from({ length: startingDay }).map((_, i) => <div key={`empty-${i}`} className="border-t border-slate-100"></div>)}
                    {daysInMonth.map(day => {
                        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const meetingsOnDay = meetingsData.filter(m => m.date.startsWith(dateStr));
                        return (
                            <div key={day} className="border-t border-slate-100 h-28 p-2 text-left">
                                <span className="font-semibold text-slate-700">{day}</span>
                                <div className="mt-1 space-y-1">
                                    {meetingsOnDay.map(meeting => (
                                        <div key={meeting.id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold p-1 rounded truncate">
                                            {meeting.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Schedule a New Meeting</h2>
                    <p className="text-slate-500 mb-6">Fill in the details and let AI help you prepare.</p>
                    <form className="space-y-5">
                        <Input label="Meeting Title / Topic" id="meeting-title" type="text" placeholder="e.g., Q3 Strategy Kick-off" value={meetingTitle} onChange={e => setMeetingTitle(e.target.value)} />
                        <Input label="Attendees" id="attendees" type="text" placeholder="e.g., John Doe, Jane Smith" />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Date" id="date" type="date" />
                            <Input label="Time" id="time" type="time" />
                        </div>
                        <div>
                             <label htmlFor="agenda" className="block text-sm font-medium text-gray-500 mb-2">Agenda</label>
                             <div className="relative">
                                <textarea id="agenda" rows={8} value={agenda} onChange={e => setAgenda(e.target.value)} className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe the meeting goals or generate an agenda with AI..."/>
                                <Button type="button" onClick={handleGenerateAgenda} isLoading={isGenerating} className="!absolute bottom-3 right-3 !py-2 !px-3" leftIcon={<SparklesIcon className="w-4 h-4"/>}>
                                    Generate with AI
                                </Button>
                             </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Schedule</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default MeetingsPage;