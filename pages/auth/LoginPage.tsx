import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AppleIcon from '../../components/icons/AppleIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import XIcon from '../../components/icons/XIcon';

// New, unique widgets for the Login page
const StatsWidget = () => (
    <div className="absolute top-24 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg w-56 animate-fade-in" style={{ animationDelay: '0.2s'}}>
        <h3 className="font-bold text-slate-800 text-sm">Weekly Growth</h3>
        <div className="flex items-end gap-2 mt-2 h-16">
            <div className="w-1/4 bg-green-200 rounded-t-md h-[40%]" style={{ animation: 'grow 0.8s ease-out forwards' }}></div>
            <div className="w-1/4 bg-green-300 rounded-t-md h-[60%]" style={{ animation: 'grow 1.0s ease-out forwards' }}></div>
            <div className="w-1/4 bg-green-200 rounded-t-md h-[50%]" style={{ animation: 'grow 0.9s ease-out forwards' }}></div>
            <div className="w-1/4 bg-green-400 rounded-t-md h-[80%]" style={{ animation: 'grow 1.2s ease-out forwards' }}></div>
        </div>
        <p className="text-xs text-green-700 font-semibold mt-1">+15.4% this week</p>
    </div>
);

const WelcomeWidget = () => (
    <div className="absolute bottom-24 right-8 bg-indigo-500 text-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s'}}>
        <img className="w-10 h-10 rounded-full border-2 border-indigo-200" src="https://i.pravatar.cc/150?img=1" alt="avatar" />
        <div>
            <h3 className="font-bold">Welcome back,</h3>
            <p className="text-sm opacity-80">Amélie Laurent</p>
        </div>
    </div>
);

const TeamWidget = () => (
    <div className="absolute bottom-10 left-8 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s'}}>
        <p className="text-sm font-semibold text-slate-700 ml-2">Team Sync</p>
        <div className="flex -space-x-3">
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=4" alt="avatar 1" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=5" alt="avatar 2" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=6" alt="avatar 3" />
        </div>
    </div>
);


const ImagePanel = () => (
    <div className="relative hidden md:block">
        <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3432&auto=format&fit=crop" 
            alt="Team collaborating on a project"
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-100/20 to-transparent"></div>
        <div className="absolute inset-0 p-8">
            <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors">
                <XIcon className="w-5 h-5" />
            </button>
            <StatsWidget />
            <WelcomeWidget />
            <TeamWidget />
        </div>
    </div>
);


const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to the profile page after successful login
        navigate('/profile');
    }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/60 backdrop-blur-lg rounded-[40px] shadow-2xl overflow-hidden animate-fade-in">
            {/* Form Panel */}
            <div className="flex flex-col justify-center p-12 bg-gradient-to-br from-yellow-50 via-white to-yellow-100/50">

                <div className="w-full max-w-sm">
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s'}}>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome Back</h1>
                        <p className="text-slate-600 mb-8">Please enter your details to sign in.</p>
                    </div>

                    <form className="space-y-5 animate-fade-in" style={{ animationDelay: '0.2s'}} onSubmit={handleSubmit}>
                        <Input label="Email" id="email" type="email" placeholder="amelielaurent7622@gmail.com" />
                        <Input label="Password" id="password" type="password" placeholder="••••••••••••" />

                         <div className="text-right text-sm">
                            <Link to="/forgot-password" className="text-slate-600 hover:underline">Forgot Password?</Link>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full">Sign In</Button>
                        </div>
                    </form>
                    
                    <div className="animate-fade-in" style={{ animationDelay: '0.3s'}}>
                        <div className="flex items-center gap-4 my-8">
                            <hr className="w-full border-slate-300" />
                            <span className="text-slate-500 text-sm">OR</span>
                            <hr className="w-full border-slate-300" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="secondary" leftIcon={<AppleIcon className="w-5 h-5" />}>Apple</Button>
                            <Button variant="secondary" leftIcon={<GoogleIcon className="w-5 h-5" />}>Google</Button>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-sm flex justify-between text-sm mt-auto pt-8 animate-fade-in" style={{ animationDelay: '0.4s'}}>
                    <span className="text-slate-600">Don't have an account? <Link to="/register" className="font-bold text-slate-800 hover:underline">Sign up</Link></span>
                    <Link to="#" className="text-slate-600 hover:underline">Terms & Conditions</Link>
                </div>
            </div>

            <ImagePanel />
        </div>
    </main>
  );
};

export default LoginPage;