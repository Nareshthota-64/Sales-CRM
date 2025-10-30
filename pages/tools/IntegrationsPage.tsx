import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import CopyIcon from '../../components/icons/CopyIcon';
import ExternalLinkIcon from '../../components/icons/ExternalLinkIcon';

const integrations = [
  { name: 'Salesforce', logo: 'https://cdn.worldvectorlogo.com/logos/salesforce-2.svg', category: 'CRM', connected: true },
  { name: 'Slack', logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', category: 'Communication', connected: true },
  { name: 'Google Calendar', logo: 'https://cdn.worldvectorlogo.com/logos/google-calendar.svg', category: 'Productivity', connected: false },
  { name: 'Outlook', logo: 'https://cdn.worldvectorlogo.com/logos/microsoft-outlook-2013.svg', category: 'Productivity', connected: false },
  { name: 'Zapier', logo: 'https://cdn.worldvectorlogo.com/logos/zapier.svg', category: 'Automation', connected: false },
  { name: 'HubSpot', logo: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg', category: 'CRM', connected: true },
];

const IntegrationsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('integrations');
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <div className="space-y-8">
            <header className="animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">Integration Hub</h1>
                <p className="text-slate-500 mt-1">Connect your favorite tools to the BDE AI System.</p>
            </header>

            <main className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="border-b border-slate-200 mb-6">
                    <nav className="-mb-px flex gap-6">
                        <button onClick={() => setActiveTab('integrations')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'integrations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            Available Integrations
                        </button>
                        <button onClick={() => setActiveTab('api')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'api' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                            API Access
                        </button>
                    </nav>
                </div>

                {activeTab === 'integrations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((integration, index) => (
                            <div key={integration.name} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between animate-fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                                <div>
                                    <div className="flex items-start justify-between">
                                        <img src={integration.logo} alt={integration.name} className="h-10 w-10" />
                                        {integration.connected ? (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Connected</span>
                                        ) : (
                                            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">Not Connected</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-800 mt-4 text-lg">{integration.name}</h3>
                                    <p className="text-sm text-slate-500">{integration.category}</p>
                                </div>
                                <div className="mt-6">
                                    {integration.connected ? (
                                        <Button variant="secondary" className="w-full">Manage</Button>
                                    ) : (
                                        <Button variant="secondary" className="w-full">Connect</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Developer API Access</h2>
                        <p className="text-slate-500 mb-6">Use our API to build custom integrations and workflows.</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Your API Key</label>
                                <div className="flex gap-2">
                                    <input type="text" readOnly value="bde_sk_************************1234" className="flex-1 p-3 bg-slate-100 rounded-lg font-mono text-sm" />
                                    <Button variant="secondary" onClick={() => handleCopy('bde_sk_************************1234')} leftIcon={<CopyIcon className="w-4 h-4"/>}>
                                        {copySuccess || 'Copy'}
                                    </Button>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2">Webhook Endpoint</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="https://yourapi.com/webhook" className="flex-1 p-3 bg-slate-100 rounded-lg text-sm" />
                                    <Button variant="secondary">Save</Button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                                    Read API Documentation <ExternalLinkIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default IntegrationsPage;