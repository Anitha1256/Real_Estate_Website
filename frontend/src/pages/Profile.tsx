import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Shield, Key, Mail, Camera, Loader2, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        about: user?.about || ''
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('http://localhost:5001/api/users/profile', formData, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            // Update auth context with new user data (token remains same or updated)
            login(data);
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setPasswordLoading(true);
        try {
            await axios.put('http://localhost:5001/api/users/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            toast.success('Password changed successfully!');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Password change failed');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-2xl relative overflow-hidden">
                            {user?.name[0]}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900">{user?.name}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2"><Shield size={16} className="text-primary-600" /> Professional {user?.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Public Profile */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <User className="text-primary-600" /> Account Identity
                            </h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            placeholder="+1 (555) 000-0000"
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address (Primary Identity)</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                        />
                                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">About / Bio</label>
                                    <textarea
                                        rows={4}
                                        value={formData.about}
                                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                        className="w-full bg-slate-50 border-none p-6 rounded-[2rem] outline-none focus:ring-2 ring-primary-500/20 transition-all font-medium text-slate-600 resize-none leading-relaxed"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Genesis Details</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white space-y-8">
                            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
                                <Key className="text-primary-400" /> Security Core
                            </h3>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Current Secret</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 py-3 px-5 rounded-xl outline-none focus:border-primary-500 transition-all font-medium text-white placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">New Secret</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 py-3 px-5 rounded-xl outline-none focus:border-primary-500 transition-all font-medium text-white placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Verify Secret</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 py-3 px-5 rounded-xl outline-none focus:border-primary-500 transition-all font-medium text-white placeholder:text-slate-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-400 transition-all disabled:opacity-70"
                                >
                                    {passwordLoading ? <Loader2 className="animate-spin" size={20} /> : 'Update Security Key'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
