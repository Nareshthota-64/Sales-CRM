import React, { useState, useRef } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CameraIcon from '../../components/icons/CameraIcon';

const ProfileCard: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=1');

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center animate-fade-in">
            <div className="relative mb-4">
                <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-slate-100"
                />
                <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-1 right-1 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 hover:bg-yellow-500 transition-all transform hover:scale-110 shadow-md"
                    aria-label="Change profile picture"
                >
                    <CameraIcon className="w-5 h-5" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Amélie Laurent</h2>
            <p className="text-slate-500">Business Development Executive</p>
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        setTimeout(() => setIsUpdatingPassword(false), 1500);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-800">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal information and password.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <ProfileCard />
                </div>

                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-md p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h3>
                        <form className="space-y-5" onSubmit={handleSaveChanges}>
                            <Input label="Full Name" id="full-name" type="text" defaultValue="Amélie Laurent" />
                            <Input label="Email Address" id="email" type="email" defaultValue="amelielaurent7622@gmail.com" />
                            <Input label="Phone Number" id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                            <div className="pt-2 text-right">
                                <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Change Password</h3>
                        <form className="space-y-5" onSubmit={handleUpdatePassword}>
                            <Input label="Current Password" id="current-password" type="password" placeholder="••••••••••••" />
                            <Input label="New Password" id="new-password" type="password" placeholder="••••••••••••" />
                            <Input label="Confirm New Password" id="confirm-password" type="password" placeholder="••••••••••••" />
                            <div className="pt-2 text-right">
                                <Button type="submit" isLoading={isUpdatingPassword}>Update Password</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
