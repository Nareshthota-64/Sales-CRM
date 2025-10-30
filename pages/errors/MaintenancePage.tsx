import React from 'react';
import ServerCogIcon from '../../components/icons/ServerCogIcon';

const MaintenancePage: React.FC = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-slate-50">
      <div className="text-center max-w-lg mx-auto">
        <div className="relative w-24 h-24 mx-auto mb-6">
            <ServerCogIcon className="w-full h-full text-indigo-300" />
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-indigo-500 animate-spin"
                    style={{ animationDuration: '3s' }}
                >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">We'll be back soon!</h1>
        <p className="mt-4 text-lg text-slate-600">
          We're currently performing scheduled maintenance to improve our system. The platform will be back online shortly.
        </p>
        <p className="mt-2 text-slate-600">Thank you for your patience.</p>
        <div className="mt-8 bg-slate-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-slate-700">Need help? Contact us at <a href="mailto:support@bdeaisystem.com" className="text-indigo-600 hover:underline">support@bdeaisystem.com</a></p>
        </div>
      </div>
    </main>
  );
};

export default MaintenancePage;