import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PlusIcon from '../../components/icons/PlusIcon';
import MapPinIcon from '../../components/icons/MapPinIcon';

const territoriesData = [
  { id: 1, name: 'West Coast', region: 'NA', leads: 450, conversionRate: 22, arr: 550000, assigned: [{ name: 'Amélie', avatar: 'https://i.pravatar.cc/150?img=1' }, { name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' }] },
  { id: 2, name: 'East Coast', region: 'NA', leads: 380, conversionRate: 19, arr: 420000, assigned: [{ name: 'Benoît', avatar: 'https://i.pravatar.cc/150?img=2' }] },
  { id: 3, name: 'Central US', region: 'NA', leads: 250, conversionRate: 15, arr: 280000, assigned: [{ name: 'Chloé', avatar: 'https://i.pravatar.cc/150?img=3' }] },
  { id: 4, name: 'EMEA', region: 'EU', leads: 310, conversionRate: 18, arr: 390000, assigned: [{ name: 'François', avatar: 'https://i.pravatar.cc/150?img=6' }] },
];

const TerritoryManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <header className="flex flex-wrap justify-between items-center gap-4 animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-slate-800">Territory Management</h1>
                    <p className="text-slate-500 mt-1">Define geographic territories and monitor regional performance.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon className="w-4 h-4" />}>
                    Define New Territory
                </Button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Map View */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Territory Overview</h2>
                    <div className="relative aspect-video bg-slate-50 rounded-lg flex items-center justify-center">
                        {/* Placeholder for an interactive map */}
                        <svg className="w-full h-full text-slate-300" fill="currentColor" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
                            <path d="M500 0 L450 150 L200 180 L350 300 L300 450 L500 380 L700 450 L650 300 L800 180 L550 150 Z" className="text-indigo-200" />
                            <circle cx="250" cy="100" r="50" className="text-blue-200" />
                            <rect x="700" y="50" width="100" height="100" className="text-green-200" />
                             <text x="500" y="250" textAnchor="middle" className="fill-slate-500 font-semibold text-4xl">Map Visualization</text>
                        </svg>
                         <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-md text-sm">
                            <h4 className="font-bold mb-2">Legend</h4>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-indigo-200" /><span>North America</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-blue-200" /><span>EMEA</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-200" /><span>APAC</span></div>
                        </div>
                    </div>
                </div>

                {/* Territory List */}
                <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    {territoriesData.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-slate-400"/>{t.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-xs text-slate-500 font-semibold">Assigned:</p>
                                        <div className="flex -space-x-2">
                                            {t.assigned.map(a => <img key={a.name} src={a.avatar} alt={a.name} className="w-6 h-6 rounded-full border border-white" />)}
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary">Manage</Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-3 border-t border-slate-100">
                                <div><p className="text-sm text-slate-500">Leads</p><p className="font-semibold text-slate-700">{t.leads}</p></div>
                                <div><p className="text-sm text-slate-500">Conv. %</p><p className="font-semibold text-slate-700">{t.conversionRate}%</p></div>
                                <div><p className="text-sm text-slate-500">ARR</p><p className="font-semibold text-slate-700">${(t.arr/1000)}k</p></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Define New Territory</h2>
                    <p className="text-slate-500 mb-6">Create a new sales region and assign personnel.</p>
                    <form className="space-y-5">
                        <input type="text" placeholder="Territory Name, e.g., 'APAC'" className="w-full p-3 bg-slate-100 rounded-lg text-sm" />
                        <select className="w-full p-3 bg-slate-100 rounded-lg text-sm">
                            <option>Assign BDE: Amélie Laurent</option>
                            <option>Assign BDE: David Garcia</option>
                            <option>Assign BDE: Benoît Dubois</option>
                        </select>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Regions</label>
                            <div className="p-4 bg-slate-100 rounded-lg text-center font-medium text-slate-500">
                                [UI for selecting countries/regions on a map would be here]
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Create Territory</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default TerritoryManagementPage;