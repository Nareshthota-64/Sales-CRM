import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { users } from '../data/users';

const allPriorities = ['High Priority', 'Important', 'OK', 'Meh', 'Not that important'];

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: { title: string; priority: string; assignees: string[] }) => void;
  defaultAssigneeId?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, defaultAssigneeId }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Important');
    const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Reset form when modal opens
            setTitle('');
            setPriority('Important');
            setSelectedAssignees(defaultAssigneeId ? [defaultAssigneeId] : []);
        }
    }, [isOpen, defaultAssigneeId]);

    const handleAssigneeToggle = (userId: string) => {
        setSelectedAssignees(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSave = () => {
        if (!title.trim() || selectedAssignees.length === 0) return;
        onSave({ title, priority, assignees: selectedAssignees });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Task</h2>
                <p className="text-slate-500 mb-6">Fill in the details for the new task.</p>
                <form className="space-y-5">
                    <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-500 mb-2">Task Title</label>
                        <textarea
                            id="task-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            rows={3}
                            placeholder="e.g., Follow-up with Innovatech about Q3 pricing..."
                            className="w-full p-3 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="task-priority" className="block text-sm font-medium text-gray-500 mb-2">Priority</label>
                            <select id="task-priority" value={priority} onChange={e => setPriority(e.target.value)} className="w-full p-3 bg-slate-100 rounded-lg text-sm border-transparent focus:ring-2 focus:ring-indigo-500">
                                {allPriorities.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Assign To</label>
                        <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                            {users.map(user => (
                                <label key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssignees.includes(user.id)}
                                        onChange={() => handleAssigneeToggle(user.id)}
                                        className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                    <span className="font-medium text-slate-700">{user.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="button" onClick={handleSave}>Save Task</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TaskModal;
