import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import BookOpenIcon from '../../components/icons/BookOpenIcon';
import SparklesIcon from '../../components/icons/SparklesIcon';

const modules = [
    { id: 1, title: 'Sales CRM Mastery', progress: 100, status: 'Completed' },
    { id: 2, title: 'Advanced Prospecting Techniques', progress: 75, status: 'In Progress' },
    { id: 3, title: 'Effective Discovery Calls', progress: 0, status: 'Not Started' },
    { id: 4, title: 'Advanced Negotiation Tactics', progress: 0, status: 'Not Started' },
];

const libraryResources = [
    { type: 'Playbook', title: 'Handling Top 5 Objections' },
    { type: 'Video', title: 'Top Performer Call: Closing Innovatech' },
    { type: 'Playbook', title: 'Vertical Deep Dive: SaaS' },
    { type: 'Video', title: 'Live Demo Best Practices' },
];

const TrainingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('playbooks');
    const [aiTip, setAiTip] = useState('Click "Get Tip" for personalized coaching.');

    const handleGetTip = () => {
        setAiTip('Your average sales cycle is 5 days longer than the team average. Focus on establishing a clear timeline with prospects early in the discovery call to shorten it.');
    };

    const overallProgress = modules.reduce((acc, m) => acc + m.progress, 0) / modules.length;
    const currentModule = modules.find(m => m.status === 'In Progress') || modules.find(m => m.status === 'Not Started');

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Training & Coaching</h1>
                <p className="text-slate-500 mt-1">Sharpen your skills and learn from the best practices.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Path & Modules */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">My Learning Path</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 mb-1">Overall Progress</p>
                                <ProgressBar value={overallProgress} />
                            </div>
                            <span className="font-bold text-indigo-600 text-lg">{Math.round(overallProgress)}%</span>
                        </div>
                        {currentModule && (
                            <div className="mt-6 bg-indigo-50 p-4 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-indigo-500">NEXT UP</p>
                                    <p className="font-bold text-indigo-800">{currentModule.title}</p>
                                </div>
                                <Button size="sm">Continue</Button>
                            </div>
                        )}
                    </div>
                    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Required Modules</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {modules.map(module => (
                                <div key={module.id} className="bg-white p-5 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-slate-800">{module.title}</h3>
                                    <p className="text-xs font-semibold text-slate-500 mt-2">{module.status}</p>
                                    <ProgressBar value={module.progress} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Coach & Library */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6 text-yellow-500" />
                            AI Coach
                        </h2>
                        <div className="bg-yellow-50/70 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <p className="text-sm text-yellow-900 font-medium">{aiTip}</p>
                        </div>
                        <Button onClick={handleGetTip} variant="secondary" size="sm" className="w-full mt-4">Get Tip of the Day</Button>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Explore Library</h2>
                        <div className="border-b border-slate-200 mb-4">
                            <nav className="-mb-px flex gap-4 text-sm font-semibold">
                                <button onClick={() => setActiveTab('playbooks')} className={`py-2 px-1 ${activeTab === 'playbooks' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}>Playbooks</button>
                                <button onClick={() => setActiveTab('videos')} className={`py-2 px-1 ${activeTab === 'videos' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-slate-500'}`}>Videos</button>
                            </nav>
                        </div>
                        <div className="space-y-3">
                            {libraryResources.filter(r => r.type.toLowerCase().includes(activeTab.slice(0, -1))).map(item => (
                                <div key={item.title} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <BookOpenIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                    <p className="text-sm text-slate-700 font-medium">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingPage;