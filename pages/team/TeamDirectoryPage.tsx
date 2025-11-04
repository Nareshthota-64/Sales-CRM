import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../components/icons/SearchIcon';
import MessageSquareIcon from '../../components/icons/MessageSquareIcon';
import { teamMembersData, TeamMember } from '../../components/data/team';

interface TeamMemberCardProps {
    member: TeamMember;
    index: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/team/${member.id}`);
    };

    const handleMessage = () => {
        navigate('/chat', { state: { memberName: member.name } });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="relative inline-block">
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100" />
                <span className={`absolute bottom-2 right-2 block h-4 w-4 rounded-full border-2 border-white ${member.online ? 'bg-green-500' : 'bg-slate-400'}`}></span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{member.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{member.role}</p>
            <div className="flex justify-center gap-3">
                <button onClick={handleViewProfile} className="flex-1 bg-slate-100 text-slate-700 text-sm font-semibold py-2 px-4 rounded-full hover:bg-slate-200 transition-colors">View Profile</button>
                <button onClick={handleMessage} className="flex-1 bg-yellow-400 text-slate-900 text-sm font-semibold py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                    <MessageSquareIcon className="w-4 h-4" />
                    Message
                </button>
            </div>
        </div>
    );
};

const TeamDirectoryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = teamMembersData.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Team Directory</h1>
                <p className="text-slate-500 mt-1">Browse and connect with your colleagues.</p>
            </div>

            <div className="mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search by name or role..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-lg py-3 pl-12 pr-4 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMembers.map((member, index) => (
                    <TeamMemberCard key={member.name} member={member} index={index + 2} />
                ))}
            </div>
        </div>
    );
};

export default TeamDirectoryPage;