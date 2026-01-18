import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, User as UserIcon, ShieldCheck, Loader2, Phone, Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5001/api/users', formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full border border-slate-100">
                <div className="text-center mb-10">
                    <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center text-primary-600 mx-auto mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                    <p className="text-slate-500">Join our community of home seekers and agents</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'user' })}
                            className={`py-3 rounded-xl font-bold transition-all border-2 ${formData.role === 'user' ? 'bg-primary-50 border-primary-600 text-primary-600' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                        >
                            Seeker
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'agent' })}
                            className={`py-3 rounded-xl font-bold transition-all border-2 ${formData.role === 'agent' ? 'bg-primary-50 border-primary-600 text-primary-600' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                        >
                            Agent
                        </button>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-primary-600 focus:bg-white transition-all font-medium text-sm"
                                placeholder="John Doe"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-primary-600 focus:bg-white transition-all font-medium text-sm"
                                placeholder="john@example.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 rounded-xl outline-none focus:border-primary-600 focus:bg-white transition-all font-medium text-sm"
                                placeholder="+1 (555) 000-0000"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-12 rounded-xl outline-none focus:border-primary-600 focus:bg-white transition-all font-medium text-sm"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
