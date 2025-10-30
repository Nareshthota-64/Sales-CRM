import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import AppleIcon from '../../components/icons/AppleIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import XIcon from '../../components/icons/XIcon';

// Small components for the image overlay to keep the main component clean
const TaskCard = () => (
    <div className="absolute top-16 -left-10 bg-yellow-400 p-4 rounded-2xl shadow-lg w-64 animate-fade-in" style={{ animationDelay: '0.2s'}}>
        <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-slate-800">Task Review With Team</h3>
            <div className="w-3 h-3 bg-yellow-900/50 rounded-full"></div>
        </div>
        <p className="text-sm text-slate-700">09:30am-10:00am</p>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 bg-slate-800/80 text-white text-xs text-center py-1 rounded-full shadow-md">
            09:30am-10:00am
        </div>
    </div>
);

const CalendarWidget = () => (
    <div className="absolute bottom-32 right-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg w-64 animate-fade-in" style={{ animationDelay: '0.4s'}}>
        <div className="grid grid-cols-7 text-center text-sm text-slate-600 font-semibold">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            <span className="text-slate-400">22</span><span className="text-slate-400">23</span><span>24</span><span className="bg-slate-900 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto">25</span><span>26</span><span>27</span><span>28</span>
        </div>
    </div>
);

const MeetingCard = () => (
     <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s'}}>
        <div>
            <h3 className="font-bold text-slate-800">Daily Meeting</h3>
            <p className="text-sm text-slate-600">12:00pm-01:00pm</p>
        </div>
        <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=1" alt="avatar 1" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=2" alt="avatar 2" />
            <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=3" alt="avatar 3" />
        </div>
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
     </div>
);

const FloatingAvatars = () => (
    <>
        <img className="w-12 h-12 rounded-full border-2 border-white shadow-lg absolute top-1/2 -mt-16 right-4 animate-fade-in" style={{ animationDelay: '0.8s'}} src="https://i.pravatar.cc/150?img=4" alt="avatar 4" />
        <img className="w-10 h-10 rounded-full border-2 border-white shadow-lg absolute top-1/2 -mt-4 right-20 animate-fade-in" style={{ animationDelay: '1s'}} src="https://i.pravatar.cc/150?img=5" alt="avatar 5" />
        <img className="w-14 h-14 rounded-full border-2 border-white shadow-lg absolute top-1/2 -mt-24 right-28 animate-fade-in" style={{ animationDelay: '1.2s'}} src="https://i.pravatar.cc/150?img=6" alt="avatar 6" />
    </>
);


const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For demo, navigate to profile, in real app this would be onboarding
        navigate('/profile');
    }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/60 backdrop-blur-lg rounded-[40px] shadow-2xl overflow-hidden animate-fade-in">
            {/* Form Panel */}
            <div className="flex flex-col justify-center p-12 bg-gradient-to-br from-yellow-50 via-white to-yellow-100/50">

                <div className="w-full max-w-sm">
                    <div className="animate-fade-in" style={{ animationDelay: '0.1s'}}>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Create an account</h1>
                        <p className="text-slate-600 mb-8">Sing up and get 30 day free trial</p>
                    </div>

                    <form className="space-y-5 animate-fade-in" style={{ animationDelay: '0.2s'}} onSubmit={handleSubmit}>
                        <Input label="Full name" id="full-name" type="text" placeholder="Amélie Laurent" autoComplete='name' />
                        <Input label="Email" id="email" type="email" placeholder="amelielaurent7622@gmail.com" autoComplete='email' />
                        <Input label="Password" id="password" type="password" placeholder="••••••••••••" autoComplete='new-password' />

                        <div className="pt-4">
                            <Button type="submit" className="w-full">Submit</Button>
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
                    <span className="text-slate-600">Have any account? <Link to="/login" className="font-bold text-slate-800 hover:underline">Sing in</Link></span>
                    <Link to="#" className="text-slate-600 hover:underline">Terms & Conditions</Link>
                </div>
            </div>

            {/* Image Panel */}
            <div className="relative hidden md:block">
                <img 
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2787&auto=format&fit=crop" 
                    alt="Team working in a modern office"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-100/20 to-transparent"></div>
                <div className="absolute inset-0 p-8">
                   <button className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors">
                        <XIcon className="w-5 h-5" />
                   </button>
                   <TaskCard />
                   <CalendarWidget />
                   <MeetingCard />
                   <FloatingAvatars />
                </div>
            </div>
        </div>
    </main>
  );
};

export default RegisterPage;