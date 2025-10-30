import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import MailIcon from '../../components/icons/MailIcon';
import LockIcon from '../../components/icons/LockIcon';
import UserIcon from '../../components/icons/UserIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import FacebookIcon from '../../components/icons/FacebookIcon';
import AppleIcon from '../../components/icons/AppleIcon';

const SocialButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <button className="w-10 h-10 border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
    {children}
  </button>
);

const Form: React.FC<{ isSignUp?: boolean }> = ({ isSignUp = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/onboarding');
    }, 1500);
  };

  return (
    <div className="w-full px-16">
      <h1 className="text-3xl font-bold text-slate-800 mb-4 text-center">
        {isSignUp ? 'Create Account' : 'Sign In'}
      </h1>
      <div className="flex justify-center space-x-3 mb-6">
        <SocialButton><GoogleIcon className="w-5 h-5" /></SocialButton>
        <SocialButton><FacebookIcon className="w-5 h-5" /></SocialButton>
        <SocialButton><AppleIcon className="w-5 h-5" /></SocialButton>
      </div>
      <p className="text-center text-sm text-slate-500 mb-6">
        or use your {isSignUp ? 'email for registration' : 'account'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <Input
            // FIX: Add required label prop. It's empty to preserve UI.
            label=""
            id="name"
            type="text"
            placeholder="Name"
            icon={<UserIcon className="w-5 h-5 text-gray-400" />}
            disabled={isLoading}
            autoComplete="name"
          />
        )}
        <Input
          // FIX: Add required label prop. It's empty to preserve UI.
          label=""
          id="email"
          type="email"
          placeholder="Email"
          icon={<MailIcon className="w-5 h-5 text-gray-400" />}
          disabled={isLoading}
          autoComplete="email"
        />
        <Input
          // FIX: Add required label prop. It's empty to preserve UI.
          label=""
          id="password"
          type="password"
          placeholder="Password"
          icon={<LockIcon className="w-5 h-5 text-gray-400" />}
          disabled={isLoading}
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
        {!isSignUp && (
            <div className="text-center pt-2">
                 <Link to="/auth/forgot-password" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                    Forgot your password?
                </Link>
            </div>
        )}
        <div className="pt-4">
          <Button type="submit" isLoading={isLoading} className="w-full">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const OverlayPanel: React.FC<{ isSignUp: boolean; toggleMode: () => void; }> = ({ isSignUp, toggleMode }) => {
  return (
    <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20 ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 h-full w-[200%] transition-transform duration-700 ease-in-out" style={{ transform: isSignUp ? 'translateX(50%)' : 'translateX(0)' }}>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className={`absolute top-0 h-full w-1/2 flex flex-col items-center justify-center text-center p-8 text-white transition-opacity duration-700 ease-in-out ${isSignUp ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-3xl font-bold mb-4">Create Account</h1>
          <p className="mb-8">Enter your personal details and start your journey with us</p>
          <button onClick={toggleMode} className="bg-transparent border-2 border-white rounded-full py-2 px-8 font-semibold uppercase tracking-wider transition-transform hover:scale-105">Sign Up</button>
        </div>
        
        <div className={`absolute top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center text-center p-8 text-white transition-opacity duration-700 ease-in-out ${isSignUp ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="mb-8">To keep connected with us please login with your personal info</p>
          <button onClick={toggleMode} className="bg-transparent border-2 border-white rounded-full py-2 px-8 font-semibold uppercase tracking-wider transition-transform hover:scale-105">Sign In</button>
        </div>

      </div>
    </div>
  );
};

const AuthPage: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(mode === 'register');

  useEffect(() => {
    setIsSignUp(mode === 'register');
  }, [mode]);

  const toggleMode = () => {
    const newMode = isSignUp ? 'login' : 'register';
    navigate(`/auth/${newMode}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-full opacity-0 z-0' : 'translate-x-0 opacity-100 z-10'}`}>
          <Form isSignUp={false} />
        </div>
        
        <div className={`absolute top-0 left-0 h-full w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-0 opacity-100 z-10' : '-translate-x-full opacity-0 z-0'}`}>
          <Form isSignUp={true} />
        </div>

        <OverlayPanel isSignUp={isSignUp} toggleMode={toggleMode} />

      </div>
    </div>
  );
};

export default AuthPage;
