import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamMembersData } from '../../components/data/team';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import ProgressBar from '../../components/ui/ProgressBar';
import DollarSignIcon from '../../components/icons/DollarSignIcon';
import PhoneCallIcon from '../../components/icons/PhoneCallIcon';
import CheckCircleIcon from '../../components/icons/CheckCircleIcon';


const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
);

const activityFeed = [
    { icon: <DollarSignIcon className="w-5 h-5 text-green-600" />, text: 'Closed deal with Innovatech ($50k ARR)', time: '2 days ago' },
    { icon: <PhoneCallIcon className="w-5 h-5 text-blue-600" />, text: 'Logged a 30-minute discovery call with Synergy LLC', time: '3 days ago' },
    { icon: <CheckCircleIcon className="w-5 h-5 text-indigo-600" />, text: 'Converted lead "Quantum Leap" to a company', time: '1 week ago' },
];

const TeamMemberProfilePage: React.FC = () => {
    const { memberId } = useParams<{ memberId: string }>();
    const navigate = useNavigate();
    const member = teamMembersData.find(m => m.id === memberId);

    if (!member) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-slate-800">Team Member Not Found</h2>
                <p className="text-slate-500">The user you are looking for does not exist.</p>
                <Link to="/team"><Button className="mt-4">Back to Team Directory</Button></Link>
            </div>
        );
    }

    const handleMessage = () => {
        navigate('/chat', { state: { memberName: member.name } });
    };
    
    const quotaAttainment = member.stats ? Math.round((member.stats.closedARR / 150000) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="animate-fade-in">
                <div className="flex items-center text-sm text-slate-500 font-medium gap-1 mb-4">
                    <Link to="/team" className="hover:text-slate-800">Team Directory</Link>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-slate-800 font-semibold">{member.name}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
                        <span className={`absolute bottom-2 right-2 block h-6 w-6 rounded-full border-4 border-white ${member.online ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">{member.name}</h1>
                        <p className="text-xl text-slate-500">{member.role}</p>
                        <Button onClick={handleMessage} size="sm" className="mt-4" leftIcon={<MessageSquareIcon className="w-4 h-4"/>}>
                            Send Message
                        </Button>
                    </div>
                </div>
            </header>

            <main className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Performance Snapshot (Q1)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard label="Closed ARR" value={`$${member.stats?.closedARR.toLocaleString() || 0}`} />
                    <StatCard label="Leads Converted" value={member.stats?.leads || 0} />
                    <StatCard label="Conversion Rate" value={`${member.stats?.conversionRate || 0}%`} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-700">Quota Attainment</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <ProgressBar value={quotaAttainment} />
                        <span className="font-bold text-indigo-600">{quotaAttainment}%</span>
                    </div>
                </div>
            </main>

            <div className="bg-white p-8 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
                 <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
                 <div className="space-y-4">
                    {activityFeed.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50/70 rounded-lg">
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <p className="text-sm text-slate-700">{item.text}</p>
                            </div>
                            <p className="text-xs text-slate-500">{item.time}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default TeamMemberProfilePage;
