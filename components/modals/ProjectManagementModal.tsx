import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SettingsIcon from '../icons/SettingsIcon';
import UsersIcon from '../icons/UsersIcon';
import GitBranchIcon from '../icons/GitBranchIcon';
import { assigneeAvatars } from '../data/users';

type Tab = 'settings' | 'members' | 'history';

interface ProjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: Tab;
  projectData: any;
  onProjectDataChange: (data: any) => void;
}

const ProjectManagementModal: React.FC<ProjectManagementModalProps> = ({ isOpen, onClose, initialTab, projectData, onProjectDataChange }) => {
    const [activeTab, setActiveTab] = useState<Tab>(initialTab);
    const [localProjectData, setLocalProjectData] = useState(projectData);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
            setLocalProjectData(projectData);
        }
    }, [isOpen, initialTab, projectData]);

    const handleSaveChanges = () => {
        onProjectDataChange(localProjectData);
        onClose();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalProjectData({ ...localProjectData, name: e.target.value });
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalProjectData({ ...localProjectData, label: e.target.value });
    };

    const TabButton: React.FC<{ tabId: Tab; icon: React.ReactNode; label: string }> = ({ tabId, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 ${activeTab === tabId ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2 w-full max-w-xl">
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex gap-4">
                        <TabButton tabId="settings" icon={<SettingsIcon className="w-4 h-4" />} label="Settings" />
                        <TabButton tabId="members" icon={<UsersIcon className="w-4 h-4" />} label="Members" />
                        <TabButton tabId="history" icon={<GitBranchIcon className="w-4 h-4" />} label="History" />
                    </nav>
                </div>
                
                <div className="min-h-[250px]">
                    {activeTab === 'settings' && (
                        <div className="space-y-5 animate-fade-in" style={{ animationDuration: '0.3s' }}>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Project Name</label>
                                <input type="text" value={localProjectData.name} onChange={handleNameChange} className="w-full p-2 bg-slate-100 rounded-lg text-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Project Label</label>
                                <input type="text" value={localProjectData.label} onChange={handleLabelChange} className="w-full p-2 bg-slate-100 rounded-lg text-sm" />
                            </div>
                        </div>
                    )}
                    {activeTab === 'members' && (
                        <div className="space-y-3 animate-fade-in" style={{ animationDuration: '0.3s' }}>
                            {localProjectData.members.map((member: any) => (
                                <div key={member.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary">Manage</Button>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-200 mt-4">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">Add Member</h4>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Search by name..." className="flex-1 p-2 bg-slate-100 rounded-lg text-sm" />
                                    <Button size="sm">Add</Button>
                                </div>
                            </div>
                        </div>
                    )}
                     {activeTab === 'history' && (
                        <div className="space-y-3 animate-fade-in max-h-64 overflow-y-auto pr-2" style={{ animationDuration: '0.3s' }}>
                            {localProjectData.history.map((item: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                        <GitBranchIcon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-700">
                                            <span className="font-semibold">{item.user}</span> {item.action}
                                        </p>
                                        <p className="text-xs text-slate-400">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                 <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectManagementModal;