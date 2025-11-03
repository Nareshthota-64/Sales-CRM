import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import SearchIcon from '../icons/SearchIcon';
import HomeIcon from '../icons/HomeIcon';
import ZapIcon from '../icons/ZapIcon';
import BuildingsIcon from '../icons/BuildingsIcon';
import UsersIcon from '../icons/UsersIcon';
import SettingsIcon from '../icons/SettingsIcon';
import HelpCircleIcon from '../icons/HelpCircleIcon';
import MailIcon from '../icons/MailIcon';
import CalendarDaysIcon from '../icons/CalendarDaysIcon';
import PhoneCallIcon from '../icons/PhoneCallIcon';
import MessageSquareIcon from '../icons/MessageSquareIcon';
import LayoutDashboardIcon from '../icons/LayoutDashboardIcon';
import FileCheckIcon from '../icons/FileCheckIcon';
import BarChartIcon from '../icons/BarChartIcon';
import SlidersIcon from '../icons/SlidersIcon';
import BotIcon from '../icons/BotIcon';
import PipelineIcon from '../icons/PipelineIcon';
import CrystalBallIcon from '../icons/CrystalBallIcon';
import ActivityIcon from '../icons/ActivityIcon';
import MapIcon from '../icons/MapIcon';
import UploadCloudIcon from '../icons/UploadCloudIcon';
import FilePieChartIcon from '../icons/FilePieChartIcon';
import LibraryIcon from '../icons/LibraryIcon';
import PuzzleIcon from '../icons/PuzzleIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import TrophyIcon from '../icons/TrophyIcon';
import StarIcon from '../icons/StarIcon';
import CrosshairIcon from '../icons/CrosshairIcon';
import BellIcon from '../icons/BellIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';


const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<'bde' | 'master' | null>(null);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role === 'master' || role === 'bde') {
            setUserRole(role as 'bde' | 'master');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    const bdeNavItems = [
        { to: '/bde/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/bde/leads', icon: <ZapIcon className="w-5 h-5" />, label: 'Leads', count: 42 },
        { to: '/bde/companies', icon: <BuildingsIcon className="w-5 h-5" />, label: 'My Companies', count: 6 },
        { to: '/team', icon: <UsersIcon className="w-5 h-5" />, label: 'Team' },
    ];
    
    const masterNavItems = [
        { to: '/master/dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
        { to: '/master/conversion-requests', icon: <FileCheckIcon className="w-5 h-5" />, label: 'Approvals', count: 12 },
        { to: '/master/companies', icon: <BuildingsIcon className="w-5 h-5" />, label: 'Companies' },
        { to: '/master/users', icon: <UsersIcon className="w-5 h-5" />, label: 'Users' },
        { to: '/master/analytics', icon: <BarChartIcon className="w-5 h-5" />, label: 'Analytics' },
        { to: '/master/territories', icon: <MapIcon className="w-5 h-5" />, label: 'Territories' },
    ];

    const communicationNavItems = [
        { to: '/communications/email', icon: <MailIcon className="w-5 h-5" />, label: 'Email Center', count: 3 },
        { to: '/communications/meetings', icon: <CalendarDaysIcon className="w-5 h-5" />, label: 'Meetings' },
        { to: '/communications/calls', icon: <PhoneCallIcon className="w-5 h-5" />, label: 'Call Logs' },
        { to: '/chat', icon: <MessageSquareIcon className="w-5 h-5" />, label: 'Internal Chat' },
    ];

    const strategyNavItems = [
        { to: '/pipeline', icon: <PipelineIcon className="w-5 h-5" />, label: 'Sales Pipeline' },
        { to: '/ai/insights', icon: <BotIcon className="w-5 h-5" />, label: 'AI Insights' },
        { to: '/analytics/predictive', icon: <CrystalBallIcon className="w-5 h-5" />, label: 'Predictive Analytics' },
        { to: '/analytics/performance', icon: <ActivityIcon className="w-5 h-5" />, label: 'Performance Intel' },
    ];
    
    const toolsNavItems = [
        { to: '/tools/import-export', icon: <UploadCloudIcon className="w-5 h-5" />, label: 'Import / Export' },
        { to: '/tools/reports', icon: <FilePieChartIcon className="w-5 h-5" />, label: 'Report Builder' },
        { to: '/tools/templates', icon: <LibraryIcon className="w-5 h-5" />, label: 'Templates' },
        { to: '/training', icon: <BookOpenIcon className="w-5 h-5" />, label: 'Training & Coaching' },
        { to: '/tools/integrations', icon: <PuzzleIcon className="w-5 h-5" />, label: 'Integrations' },
    ];

    const gamificationNavItems = [
        { to: '/gamification/leaderboard', icon: <TrophyIcon className="w-5 h-5" />, label: 'Leaderboard' },
        { to: '/gamification/achievements', icon: <StarIcon className="w-5 h-5" />, label: 'Achievements' },
        { to: '/gamification/goals', icon: <CrosshairIcon className="w-5 h-5" />, label: 'Goals' },
    ];
    
    const commonNavItems = [
        { to: '/settings', icon: <SettingsIcon className="w-5 h-5" />, label: 'Settings' },
        { to: '/help', icon: <HelpCircleIcon className="w-5 h-5" />, label: 'Help' },
    ];

    if (!userRole) {
        return null; // or a loading spinner
    }

    const navItems = userRole === 'master' ? masterNavItems : bdeNavItems;
    const profile = userRole === 'master' 
        ? { name: 'Master Admin', role: 'System Controller', avatar: 'https://i.pravatar.cc/150?img=12' }
        : { name: 'Amélie Laurent', role: 'BDE', avatar: 'https://i.pravatar.cc/150?img=1' };

    const finalToolsNavItems = userRole === 'master' 
        ? toolsNavItems.filter(item => item.label !== 'Training & Coaching') 
        : toolsNavItems.filter(item => item.label !== 'Integrations');

    const finalGamificationNavItems = userRole === 'master'
        ? gamificationNavItems.filter(item => item.label !== 'Achievements' && item.label !== 'Goals')
        : gamificationNavItems;

    return (
        <div className="flex h-screen bg-[#F4F7FE] font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col">
                <div className="p-6 border-b border-slate-200/80 h-20 flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="data:image/jpeg;base64,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" alt="HighQ-Labs Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-slate-800">BDE AI System</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{userRole === 'master' ? 'Admin Menu' : 'Menu'}</p>
                        <ul className="space-y-1">
                            {navItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} end={item.to.endsWith('/dashboard')} className={({ isActive }) => `flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        {item.count && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${'bg-indigo-200 text-indigo-800'}`}>{item.count}</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Communications</p>
                        <ul className="space-y-1">
                            {communicationNavItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => `flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                        {item.count && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${'bg-yellow-200 text-yellow-800'}`}>{item.count}</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Strategy</p>
                        <ul className="space-y-1">
                            {strategyNavItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => `flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tools</p>
                        <ul className="space-y-1">
                            {finalToolsNavItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        {item.icon}<span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {finalGamificationNavItems.length > 0 &&
                        <div>
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Gamification</p>
                            <ul className="space-y-1">
                                {finalGamificationNavItems.map(item => (
                                    <li key={item.to}>
                                        <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                            {item.icon}<span>{item.label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">General</p>
                        <ul className="space-y-1">
                            {commonNavItems.map(item => (
                                <li key={item.to}>
                                    <NavLink to={item.to} className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        {item.icon}<span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                             {userRole === 'master' && (
                                 <li>
                                    <NavLink to="/master/admin" className={({ isActive }) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                        <SlidersIcon className="w-5 h-5" />
                                        <span>System Admin</span>
                                    </NavLink>
                                 </li>
                             )}
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 flex items-center justify-between px-8 flex-shrink-0 z-10">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search..." className="w-full sm:w-80 bg-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/notifications" className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                            <BellIcon className="w-6 h-6" />
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white animate-pulse"></span>
                        </Link>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div className="relative" ref={profileMenuRef}>
                            <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                <img className="w-9 h-9 rounded-full" src={profile.avatar} alt="avatar" />
                                <div className="hidden sm:block">
                                    <p className="text-sm font-bold text-slate-800 text-left">{profile.name}</p>
                                    <p className="text-xs text-slate-500 text-left">{profile.role}</p>
                                </div>
                                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                                    <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setProfileOpen(false)}>My Profile</Link>
                                    <Link to="/settings" className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" onClick={() => setProfileOpen(false)}>Settings</Link>
                                    <hr className="my-1 border-slate-100" />
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;