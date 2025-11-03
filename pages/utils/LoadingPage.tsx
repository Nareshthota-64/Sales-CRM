import React, { useState, useEffect } from 'react';

const loadingMessages = [
    'Initializing AI Core...',
    'Analyzing Performance Data...',
    'Preparing Your Dashboard...',
    'Unlocking Insights...',
    'Almost there...',
];

const LoadingPage: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 1500); // Change message every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F7FE] flex-col font-sans">
            <div className="relative flex items-center justify-center">
                {/* Pulsing glow effect */}
                <div className="absolute w-48 h-48 bg-indigo-200 rounded-full animate-ping opacity-50"></div>
                
                <div className="relative w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <img src="data:image/jpeg;base64,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" alt="HighQ-Labs Logo" className="w-20 h-20 animate-pulse" />
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-xl font-semibold text-slate-700 transition-opacity duration-500">
                    {loadingMessages[messageIndex]}
                </p>
                <div className="w-64 h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full animate-loading-bar"></div>
                </div>
            </div>
             <style>{`
                @keyframes loading-bar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s infinite ease-in-out;
                }
             `}</style>
        </div>
    );
};

export default LoadingPage;