import React, { useState, useMemo } from 'react';
import RadarChart from '../../components/charts/RadarChart';
import ProgressBar from '../../components/ui/ProgressBar';
import LightbulbIcon from '../../components/icons/LightbulbIcon';
import ActivityIcon from '../../components/icons/ActivityIcon';
import TargetIcon from '../../components/icons/TargetIcon';
import ClockIcon from '../../components/icons/ClockIcon';

// Mock Data
const teamAverage = { quota: 85, activity: 75, winRate: 60, dealSize: 55, cycle: 70 }; // cycle is inverted (lower is better)

const bdeData = {
    'Amélie Laurent': { quota: 110, activity: 80, winRate: 70, dealSize: 85, cycle: 60, avatar: 'https://i.pravatar.cc/150?img=1' },
    'Benoît Dubois': { quota: 90, activity: 65, winRate: 55, dealSize: 60, cycle: 80, avatar: 'https://i.pravatar.cc/150?img=2' },
    'Chloé Martin': { quota: 75, activity: 90, winRate: 50, dealSize: 45, cycle: 75, avatar: 'https://i.pravatar.cc/150?img=3' },
};

const aiCoaching = {
    'Amélie Laurent': [
        "Leverage high deal size by focusing on enterprise accounts.",
        "Maintain current activity levels, as they are yielding great results.",
    ],
    'Benoît Dubois': [
        "Increase prospecting activity to build a larger pipeline.",
        "Focus on discovery calls to improve win rate and deal size.",
        "Review successful sales cycles to identify ways to shorten yours.",
    ],
     'Chloé Martin': [
        "High activity is excellent! Focus on converting this into qualified leads.",
        "Partner with Amélie to learn strategies for increasing average deal size.",
    ],
    'Team Overview': [
        "Team is exceeding quota on average, which is great.",
        "Focus on improving overall win rate through targeted coaching.",
        "Share best practices from top performers on shortening sales cycles.",
    ]
};

const radarLabels = ['Quota', 'Activity', 'Win Rate', 'Deal Size', 'Sales Cycle'];

// Helper Components
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; children?: React.ReactNode }> = ({ icon, label, value, children }) => (
    <div className="bg-slate-50/70 p-4 rounded-xl">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-500">{icon}</div>
            <p className="font-semibold text-slate-600">{label}</p>
        </div>
        <p className="text-2xl font-bold text-slate-800 mt-3">{value}</p>
        {children && <div className="mt-2">{children}</div>}
    </div>
);

const PerformanceIntelligencePage: React.FC = () => {
    const [selectedBde, setSelectedBde] = useState('Team Overview');

    const displayData = useMemo(() => {
        if (selectedBde === 'Team Overview') {
            const teamData = {
                quota: { value: 95, label: '115%', target: '$95k / $100k' },
                activity: { value: 78, label: '78', target: 'vs. 75 target' },
                winRate: { value: 58, label: '21%', target: 'vs. 25% target' },
                cycle: { value: 72, label: '42 days', target: 'vs. 38 day target' }
            };
            const radar = radarLabels.map(label => {
                const key = label.toLowerCase().replace(' ', '');
                return { label, individual: teamAverage[key] * 1.05, average: teamAverage[key] };
            });
            return { kpis: teamData, radar, coaching: aiCoaching['Team Overview'] };
        }
        
        const individual = bdeData[selectedBde];
        const kpis = {
            quota: { value: individual.quota, label: `${individual.quota}%`, target: `$${individual.quota}k / $100k` },
            activity: { value: individual.activity, label: `${individual.activity}`, target: 'vs. 75 target' },
            winRate: { value: individual.winRate / 1.5, label: `${Math.round(individual.winRate / 1.5)}%`, target: 'vs. 25% target' },
            cycle: { value: individual.cycle, label: `${Math.round(individual.cycle/2)} days`, target: 'vs. 38 day target' }
        };
        const radar = radarLabels.map(label => {
            const key = label.toLowerCase().replace(' ', '');
            return { label, individual: individual[key], average: teamAverage[key] };
        });
        return { kpis, radar, coaching: aiCoaching[selectedBde] };

    }, [selectedBde]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Performance Intelligence</h1>
          <p className="text-slate-500 mt-1">Diagnose individual and team performance with AI-driven insights.</p>
        </div>
        <div>
            <select value={selectedBde} onChange={e => setSelectedBde(e.target.value)} className="bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 p-3">
                <option>Team Overview</option>
                {Object.keys(bdeData).map(name => <option key={name}>{name}</option>)}
            </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scorecard */}
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-6">
                {selectedBde !== 'Team Overview' && <img src={bdeData[selectedBde].avatar} className="w-12 h-12 rounded-full" />}
                <h3 className="text-xl font-bold text-slate-800">{selectedBde} Scorecard</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard icon={<TargetIcon className="w-5 h-5"/>} label="Quota Attainment" value={displayData.kpis.quota.label}>
                    <ProgressBar value={displayData.kpis.quota.value} />
                    <p className="text-xs text-slate-500 mt-1 text-right">{displayData.kpis.quota.target}</p>
                </StatCard>
                 <StatCard icon={<ActivityIcon className="w-5 h-5"/>} label="Activity Score" value={displayData.kpis.activity.label}>
                    <ProgressBar value={displayData.kpis.activity.value} color="bg-yellow-500" />
                    <p className="text-xs text-slate-500 mt-1 text-right">{displayData.kpis.activity.target}</p>
                </StatCard>
                 <StatCard icon={<LightbulbIcon className="w-5 h-5"/>} label="Win Rate" value={displayData.kpis.winRate.label}>
                    <ProgressBar value={displayData.kpis.winRate.value} color="bg-green-500" />
                    <p className="text-xs text-slate-500 mt-1 text-right">{displayData.kpis.winRate.target}</p>
                </StatCard>
                 <StatCard icon={<ClockIcon className="w-5 h-5"/>} label="Avg. Sales Cycle" value={displayData.kpis.cycle.label}>
                    <ProgressBar value={100 - displayData.kpis.cycle.value} color="bg-red-500" />
                    <p className="text-xs text-slate-500 mt-1 text-right">{displayData.kpis.cycle.target}</p>
                </StatCard>
            </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Performance vs. Team Average</h3>
            <div className="flex gap-4 text-sm justify-center mb-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm" /><span>{selectedBde === 'Team Overview' ? 'Team' : selectedBde}</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-300 rounded-sm" /><span>Team Average</span></div>
            </div>
            <div className="h-72">
                <RadarChart data={displayData.radar} key={selectedBde} />
            </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <LightbulbIcon className="w-6 h-6 text-yellow-500" />
            AI Coaching Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayData.coaching.map((tip, index) => (
                <div key={index} className="bg-yellow-50/70 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <p className="text-yellow-800 font-medium">{tip}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceIntelligencePage;