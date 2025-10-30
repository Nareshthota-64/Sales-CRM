import React, { useMemo } from 'react';
import ProgressBar from '../../components/ui/ProgressBar';

const achievementsData = [
  { id: 'a1', title: 'First Contact', description: 'Log your first call or send your first email.', unlocked: true, icon: '📞' },
  { id: 'a2', title: 'Lead Scavenger', description: 'Add 10 new leads to the system.', unlocked: true, icon: '🔍' },
  { id: 'a3', title: 'Closer in Training', description: 'Convert your first lead into a company.', unlocked: true, icon: ' handshake' },
  { id: 'a4', title: 'Hot Streak', description: 'Qualify 3 "Hot" leads in a single week.', unlocked: true, icon: '🔥' },
  { id: 'a5', title: 'Conversion King', description: 'Successfully convert 10 leads.', unlocked: false, icon: '👑' },
  { id: 'a6', title: 'Pipeline Pro', description: 'Manage 20+ deals in your pipeline simultaneously.', unlocked: true, icon: '📊' },
  { id: 'a7', title: 'Email Virtuoso', description: 'Use the AI email composer 25 times.', unlocked: true, icon: '✍️' },
  { id: 'a8', title: 'The Juggernaut', description: 'Close over $100k in ARR in a single month.', unlocked: false, icon: '🚀' },
  { id: 'a9', title: 'Team Player', description: 'Participate in 50 internal chat conversations.', unlocked: true, icon: '💬' },
  { id: 'a10', title: 'Consistency is Key', description: 'Meet your activity goals for 4 consecutive weeks.', unlocked: false, icon: '🗓️' },
  { id: 'a11', title: 'Master of the Hunt', description: 'Add 100 new leads.', unlocked: false, icon: '🎯' },
  { id: 'a12', title: 'Deal Maker', description: 'Close 25 total deals.', unlocked: false, icon: '💰' },
];

const AchievementCard: React.FC<(typeof achievementsData)[0]> = ({ title, description, unlocked, icon }) => (
    <div className={`p-6 rounded-2xl transition-all duration-300 ${unlocked ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
        <div className={`text-4xl mb-4 transition-transform duration-300 ${unlocked ? 'transform scale-100' : 'transform scale-90 grayscale'}`}>{icon}</div>
        <h3 className={`font-bold ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{title}</h3>
        <p className={`text-sm mt-1 ${unlocked ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>
    </div>
);


const AchievementsPage: React.FC = () => {
    const unlockedCount = useMemo(() => achievementsData.filter(a => a.unlocked).length, []);
    const totalCount = achievementsData.length;
    const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800">Your Achievements</h1>
        <p className="text-slate-500 mt-1">Celebrate your milestones and track your progress.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800">Overall Progress</h3>
            <p className="font-semibold text-indigo-600">{unlockedCount} / {totalCount} Unlocked</p>
        </div>
        <ProgressBar value={progress} />
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievementsData.map((achievement, index) => (
            <div key={achievement.id} className="animate-fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                 <AchievementCard {...achievement} />
            </div>
        ))}
      </main>
    </div>
  );
};

export default AchievementsPage;