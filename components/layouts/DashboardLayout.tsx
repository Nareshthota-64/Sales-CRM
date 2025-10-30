import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import SearchIcon from '../icons/SearchIcon';
import HomeIcon from '../icons/HomeIcon';
import TasksIcon from '../icons/TasksIcon';
import UsersIcon from '../icons/UsersIcon';
import SettingsIcon from '../icons/SettingsIcon';
import HelpCircleIcon from '../icons/HelpCircleIcon';
import ArrowUpRightIcon from '../icons/ArrowUpRightIcon';
import XIcon from '../icons/XIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';
import IntegrationsIcon from '../icons/IntegrationsIcon';
import ZapIcon from '../icons/ZapIcon';
import BuildingsIcon from '../icons/BuildingsIcon';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const navItems = [
        { to: '/bde/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Home' },
        { to: '/bde/leads', icon: <ZapIcon className="w-5 h-5" />, label: 'Leads', count: 42 },
        { to: '/bde/companies', icon: <BuildingsIcon className="w-5 h-5" />, label: 'My Companies', count: 6 },
        { to: '/bde/dashboard', icon: <TasksIcon className="w-5 h-5" />, label: 'Tasks' },
        { to: '/team', icon: <UsersIcon className="w-5 h-5" />, label: 'Users', count: 2 },
    ];
    
    const secondaryNavItems = [
        { icon: <AnalyticsIcon className="w-5 h-5" />, label: 'Analytics' },
        { icon: <IntegrationsIcon className="w-5 h-5" />, label: 'Integrations' },
        { icon: <SettingsIcon className="w-5 h-5" />, label: 'Settings' },
        { icon: <HelpCircleIcon className="w-5 h-5" />, label: 'Help & Support' },
    ]

    return (
        <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col p-6 fixed h-full">
            <div className="flex items-center gap-3 mb-8">
                <BrainCircuitIcon className="w-8 h-8 text-indigo-500" />
                <span className="text-xl font-bold text-slate-800">BDE AI System</span>
            </div>

            <div className="relative mb-6">
                 <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                 <input type="text" placeholder="Search..." className="w-full bg-slate-100 rounded-lg py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <nav className="flex-grow flex flex-col justify-between">
                <div>
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li key={item.label}>
                                {/* FIX: Use a function as children for NavLink to pass the `isActive` state to child elements. */}
                                <NavLink to={item.to} end={item.to === '/bde/dashboard'} className={({ isActive }) => `flex items-center justify-between py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </div>
                                            {item.count && <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>{item.count}</span>}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                     <hr className="my-4 border-slate-200" />
                      <ul className="space-y-1">
                        {secondaryNavItems.map(item => (
                            <li key={item.label}>
                                <NavLink to="/settings" className={({isActive}) => `flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold ${isActive && item.label === 'Settings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'} transition-colors`}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img className="w-10 h-10 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="avatar" />
                            <div>
                                <p className="text-sm font-bold text-slate-800">Amélie Laurent</p>
                                <p className="text-xs text-slate-500">Basic Member</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-slate-800">
                            <ArrowUpRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex bg-[#F4F7FE] font-sans">
            <Sidebar />
            <main className="flex-1 w-full ml-72">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;