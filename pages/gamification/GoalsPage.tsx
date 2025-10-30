import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ProgressBar from '../../components/ui/ProgressBar';
import PlusIcon from '../../components/icons/PlusIcon';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';

// Mock Data
const activeGoalsData = [
  { id: 1, title: 'Convert 15 Leads this Month', metric: 'Leads Converted', current: 12, target: 15, reward: '+500 Points' },
  { id: 2, title: 'Close $50k in New ARR', metric: 'Closed ARR', current: 35000, target: 50000, reward: '+1000 Points' },
  { id: 3, title: 'Maintain an 80+ Activity Score', metric: 'Activity Score', current: 85, target: 80, reward: '+250 Points' },
];

const completedGoalsData = [
  { id: 4, title: 'Qualify 10 "Hot" Leads', metric: 'Hot Leads', current: 11, target: 10, reward: '+300 Points' },
  { id: 5, title: 'Book 20 Demos in Q2', metric: 'Demos Booked', current: 22, target: 20, reward: '+400 Points' },
];

interface Goal {
    id: number;
    title: string;
    metric: string;
    current: number;
    target: number;
    reward: string;
}

const GoalCard: React.FC<{ goal: Goal; isCompleted?: boolean }> = ({ goal, isCompleted = false }) => {
    const progress = (goal.current / goal.target) * 100;
    const isCurrency = goal.metric === 'Closed ARR';
    const formatValue = (val: number) => isCurrency ? `$${(val/1000).toFixed(0)}k` : val.toString();

    return (
        <div className={`p-6 rounded-2xl ${isCompleted ? 'bg-slate-50' : 'bg-white shadow-sm'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`font-bold ${isCompleted ? 'text-slate-600' : 'text-slate-800'}`}>{goal.title}</h3>
                    <p className={`text-sm mt-1 ${isCompleted ? 'text-slate-500' : 'text-slate-500'}`}>{goal.metric}</p>
                </div>
                {isCompleted ? (
                    <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                        <CheckCircleIcon className="w-5 h-5" />
                        Completed
                    </div>
                ) : (
                    <p className="font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md text-xs">{goal.reward}</p>
                )}
            </div>
            <div className="mt-4">
                <ProgressBar value={progress} color={isCompleted ? 'bg-green-500' : 'bg-indigo-500'} />
                <div className="flex justify-between text-sm mt-1">
                    <span className={isCompleted ? 'text-slate-500' : 'font-semibold text-slate-700'}>
                        {formatValue(goal.current)}
                    </span>
                    <span className="text-slate-500">{formatValue(goal.target)}</span>
                </div>
            </div>
        </div>
    );
};

const GoalsPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Performance Goals</h1>
          <p className="text-slate-500 mt-1">Set targets, track your progress, and earn rewards.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>
          Set New Goal
        </Button>
      </header>

      <main className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>Active Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoalsData.map((goal, index) => (
                    <div key={goal.id} className="animate-fade-in" style={{ animationDelay: `${200 + index * 100}ms`}}>
                        <GoalCard goal={goal} />
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>Completed Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {completedGoalsData.map((goal, index) => (
                    <div key={goal.id} className="animate-fade-in" style={{ animationDelay: `${400 + index * 100}ms`}}>
                        <GoalCard goal={goal} isCompleted />
                    </div>
                ))}
            </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-2">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Set a New Goal</h2>
            <p className="text-slate-500 mb-6">Define your next objective.</p>
            <form className="space-y-5">
                <input type="text" placeholder="Goal Title, e.g., 'Book 15 Demos this Month'" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                <div className="grid grid-cols-2 gap-4">
                     <select className="w-full p-3 bg-slate-100 rounded-lg text-sm">
                        <option>Metric: Leads Converted</option>
                        <option>Metric: Closed ARR</option>
                        <option>Metric: Demos Booked</option>
                        <option>Metric: Activity Score</option>
                    </select>
                    <input type="number" placeholder="Target Value" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                </div>
                <input type="text" placeholder="Reward (e.g., +500 Points)" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Set Goal</Button>
                </div>
            </form>
        </div>
      </Modal>
    </div>
  );
};

export default GoalsPage;