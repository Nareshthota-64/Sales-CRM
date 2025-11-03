import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Meeting } from '../../pages/communications/MeetingsPage';
import CalendarIcon from '../icons/CalendarIcon';
import ClockIcon from '../icons/ClockIcon';
import UsersIcon from '../icons/UsersIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';

interface MeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
  onDelete: () => void;
  onEdit: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <div className="text-slate-800">{children}</div>
        </div>
    </div>
);

const MeetingDetailModal: React.FC<MeetingDetailModalProps> = ({ isOpen, onClose, meeting, onDelete, onEdit }) => {
    if (!meeting) return null;

    const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const formatTime = (date: Date) => new Date(date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{meeting.title}</h2>
                <div className="space-y-4">
                    <DetailItem icon={<CalendarIcon className="w-5 h-5" />} label="Date">
                        <p>{formatDate(meeting.start)}</p>
                    </DetailItem>
                    <DetailItem icon={<ClockIcon className="w-5 h-5" />} label="Time">
                        <p>{formatTime(meeting.start)} - {formatTime(meeting.end)}</p>
                    </DetailItem>
                    <DetailItem icon={<UsersIcon className="w-5 h-5" />} label="Attendees">
                        <div className="flex flex-wrap gap-2">
                            {meeting.attendees.map(att => <span key={att} className="bg-slate-100 text-slate-700 text-sm font-medium px-2 py-1 rounded-md">{att}</span>)}
                        </div>
                    </DetailItem>
                    <DetailItem icon={<FileTextIcon className="w-5 h-5" />} label="Agenda">
                        <div className="whitespace-pre-wrap text-sm bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto">{meeting.agenda}</div>
                    </DetailItem>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onDelete} className="!text-red-600 hover:!bg-red-50 !border-red-200" leftIcon={<TrashIcon className="w-4 h-4"/>}>Delete</Button>
                    <Button onClick={onEdit} leftIcon={<EditIcon className="w-4 h-4"/>}>Edit</Button>
                </div>
            </div>
        </Modal>
    );
};


// Dummy icon
const FileTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);


export default MeetingDetailModal;
