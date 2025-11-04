import React, { useState, useRef, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SendIcon from '../icons/SendIcon';
import { assigneeAvatars } from '../data/users';

// Assuming Comment and Task interfaces are defined somewhere accessible or passed in full
interface Comment {
  user: string;
  avatar: string;
  text: string;
  time: string;
}
interface Task {
  id: string;
  title: string;
  commentData?: Comment[];
}

interface TaskCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onAddComment: (taskId: string, commentText: string) => void;
  currentUser: string;
}

const TaskCommentsModal: React.FC<TaskCommentsModalProps> = ({ isOpen, onClose, task, onAddComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && task?.commentData && task.commentData.length > 0) {
            setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [isOpen, task?.commentData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && task) {
            onAddComment(task.id, newComment.trim());
            setNewComment('');
        }
    };

    if (!task) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2 flex flex-col h-[70vh] max-h-[500px]">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Comments on:</h2>
                <p className="text-slate-600 font-semibold mb-4 truncate">{task.title}</p>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                    {task.commentData && task.commentData.length > 0 ? (
                        task.commentData.map((comment, index) => {
                            const isCurrentUser = comment.user === currentUser;
                            return (
                                <div key={index} className={`flex items-start gap-3 animate-fade-in ${isCurrentUser ? 'flex-row-reverse' : ''}`} style={{ animationDelay: `${index * 50}ms`}}>
                                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full mt-1" />
                                    <div className={`flex-1 p-3 rounded-lg max-w-[80%] ${isCurrentUser ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                        <div className={`flex items-baseline gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                            <p className="font-bold text-slate-800 text-sm">{comment.user}</p>
                                            <p className="text-xs text-slate-500">{comment.time}</p>
                                        </div>
                                        <p className={`text-sm text-slate-700 ${isCurrentUser ? 'text-right' : ''}`}>{comment.text}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-slate-500 py-8">No comments yet.</div>
                    )}
                    <div ref={commentsEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="relative mt-auto">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSubmit(e); } }}
                        placeholder="Add a comment..."
                        rows={2}
                        className="w-full bg-slate-100 rounded-lg py-2 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 disabled:text-slate-400" disabled={!newComment.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default TaskCommentsModal;