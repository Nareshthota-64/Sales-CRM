import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamMembersData } from '../../components/data/team';
import Button from '../../components/ui/Button';
import ChevronRightIcon from '../../components/icons/ChevronRightIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import ProgressBar from '../../components/ui/ProgressBar';

const StatCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
);

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
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 animate-fade-in">
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
        </div>
    );
};

export default TeamMemberProfilePage;