import React from 'react';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-grid-slate-200/[0.4] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
      
      <div className="w-full max-w-md mx-auto z-10">
        <div className="flex justify-center items-center mb-8 animate-fade-in">
          <BrainCircuitIcon className="w-12 h-12 text-indigo-500" />
          <h1 className="ml-4 text-3xl font-bold text-slate-800 tracking-tight">
            BDE AI System
          </h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-center text-2xl font-semibold text-slate-800 mb-2">{title}</h2>
          <p className="text-center text-slate-500 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;