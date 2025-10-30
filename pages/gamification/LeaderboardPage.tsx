import React, { useState, useMemo } from 'react';
import CrownIcon from '../../components/icons/CrownIcon';

const leaderboardData = {
  Weekly: [
    { rank: 1, name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', points: 1250, leads: 15, arr: 50000 },
    { rank: 2, name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', points: 1100, leads: 12, arr: 35000 },
    { rank: 3, name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', points: 980, leads: 18, arr: 20000 },
    { rank: 4, name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', points: 850, leads: 10, arr: 15000 },
    { rank: 5, name: 'François Lambert', avatar: 'https://i.pravatar.cc/150?img=6', points: 720, leads: 8, arr: 10000 },
  ],
  Monthly: [
    { rank: 1, name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', points: 4800, leads: 55, arr: 180000 },
    { rank: 2, name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', points: 4500, leads: 50, arr: 150000 },
    { rank: 3, name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', points: 4200, leads: 65, arr: 90000 },
    { rank: 4, name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', points: 3800, leads: 45, arr: 75000 },
    { rank: 5, name: 'François Lambert', avatar: 'https://i.pravatar.cc/150?img=6', points: 3500, leads: 40, arr: 60000 },
  ],
  Quarterly: [
    { rank: 1, name: 'David Garcia', avatar: 'https://i.pravatar.cc/150?img=4', points: 12500, leads: 150, arr: 450000 },
    { rank: 2, name: 'Amélie Laurent', avatar: 'https://i.pravatar.cc/150?img=1', points: 12200, leads: 145, arr: 550000 },
    { rank: 3, name: 'Chloé Martin', avatar: 'https://i.pravatar.cc/150?img=3', points: 11800, leads: 180, arr: 250000 },
    { rank: 4, name: 'Benoît Dubois', avatar: 'https://i.pravatar.cc/150?img=2', points: 11000, leads: 130, arr: 200000 },
    { rank: 5, name: 'François Lambert', avatar: 'https://i.pravatar.cc/150?img=6', points: 10500, leads: 120, arr: 180000 },
  ],
};

type Timeframe = 'Weekly' | 'Monthly' | 'Quarterly';

const LeaderboardPage: React.FC = () => {
    const [timeframe, setTimeframe] = useState<Timeframe>('Monthly');
    const data = leaderboardData[timeframe];
    const [top3, others] = [data.slice(0, 3), data.slice(3)];
    const currentUser = 'Amélie Laurent';

  return (
    <div className="space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800">Leaderboard</h1>
        <p className="text-slate-500 mt-1">See how you stack up against the competition.</p>
      </header>

      <div className="flex justify-center bg-white p-2 rounded-xl shadow-sm w-max mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
        {(['Weekly', 'Monthly', 'Quarterly'] as Timeframe[]).map(t => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-colors ${timeframe === t ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="relative grid grid-cols-3 gap-4 items-end text-center animate-fade-in" style={{ animationDelay: '200ms' }}>
        {/* 2nd Place */}
        {top3[1] && <PodiumCard user={top3[1]} rank={2} />}
        {/* 1st Place */}
        {top3[0] && <PodiumCard user={top3[0]} rank={1} />}
        {/* 3rd Place */}
        {top3[2] && <PodiumCard user={top3[2]} rank={3} />}
      </div>

      {/* Ranking Table */}
      <div className="bg-white p-4 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase">
                    <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3 text-right">Points</th>
                        <th className="px-4 py-3 text-right">Leads Converted</th>
                        <th className="px-4 py-3 text-right">Closed ARR</th>
                    </tr>
                </thead>
                <tbody>
                    {others.map((user, index) => (
                        <tr key={user.rank} className={`border-b border-slate-100 transition-colors ${user.name === currentUser ? 'bg-indigo-50' : 'hover:bg-slate-50/50'}`}>
                           <td className="px-4 py-3 font-bold text-slate-700">{user.rank}</td>
                           <td className="px-4 py-3">
                               <div className="flex items-center gap-3">
                                   <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full"/>
                                   <p className="font-bold text-slate-800">{user.name}</p>
                               </div>
                           </td>
                           <td className="px-4 py-3 font-bold text-indigo-600 text-right">{user.points.toLocaleString()}</td>
                           <td className="px-4 py-3 font-semibold text-slate-700 text-right">{user.leads}</td>
                           <td className="px-4 py-3 font-semibold text-slate-700 text-right">${user.arr.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const PodiumCard: React.FC<{ user: any, rank: number }> = ({ user, rank }) => {
    const styles = {
        1: { height: 'h-48', bg: 'bg-gradient-to-b from-amber-300 to-amber-500', shadow: 'shadow-amber-500/50', text: 'text-amber-900' },
        2: { height: 'h-40', bg: 'bg-gradient-to-b from-slate-300 to-slate-500', shadow: 'shadow-slate-500/50', text: 'text-slate-900' },
        3: { height: 'h-32', bg: 'bg-gradient-to-b from-yellow-600 to-yellow-800', shadow: 'shadow-yellow-800/50', text: 'text-yellow-100' },
    };
    return (
        <div className="flex flex-col items-center">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-2 z-10" />
            <div className={`relative w-full ${styles[rank].bg} rounded-t-xl p-4 shadow-xl ${styles[rank].shadow} ${styles[rank].height} flex flex-col justify-end`}>
                {rank === 1 && <CrownIcon className="w-8 h-8 absolute -top-12 left-1/2 -translate-x-1/2 text-amber-400" />}
                <p className={`font-bold text-lg ${styles[rank].text}`}>{user.name}</p>
                <p className={`font-black text-4xl ${styles[rank].text}`}>{rank}</p>
                 <p className={`font-bold text-sm ${styles[rank].text}`}>{user.points.toLocaleString()} pts</p>
            </div>
        </div>
    );
};

export default LeaderboardPage;