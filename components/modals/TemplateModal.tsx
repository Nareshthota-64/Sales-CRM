import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: { name: string; subject: string; content: string }) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setSubject('');
            setContent('');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!name.trim() || !subject.trim() || !content.trim()) return;
        onSave({ name, subject, content });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Template</h2>
                <p className="text-slate-500 mb-6">Save this content for future use in your emails.</p>
                <form className="space-y-4">
                    <Input label="Template Name" id="template-name" type="text" placeholder="e.g., Q3 Follow-Up" value={name} onChange={e => setName(e.target.value)} />
                    <Input label="Subject Line" id="template-subject" type="text" placeholder="Subject for the email" value={subject} onChange={e => setSubject(e.target.value)} />
                    <div>
                        <label htmlFor="template-content" className="block text-sm font-medium text-gray-500 mb-2">Content</label>
                        <textarea
                            id="template-content"
                            rows={6}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full p-3 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Hi [Name], I'm writing to..."
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="button" onClick={handleSave}>Save Template</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default TemplateModal;
