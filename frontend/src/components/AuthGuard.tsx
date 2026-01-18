import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="relative">
            {!user && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500" />

                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <Lock className="text-primary-600" size={32} />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                            MEMBERS ONLY
                        </h2>
                        <p className="text-slate-500 mb-10 text-lg leading-relaxed">
                            Join our exclusive community to access premium listings, market insights, and elite agent services.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group"
                            >
                                Sign In to Continue
                                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full bg-white text-slate-700 border-2 border-slate-100 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
                            >
                                Create Account
                                <UserPlus size={20} className="group-hover:scale-110 transition-transform text-slate-400 group-hover:text-primary-600" />
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
                            <ShieldCheck size={16} />
                            Secure Access Required
                        </div>
                    </motion.div>
                </div>
            )}
            <div className={!user ? 'h-screen overflow-hidden filter blur-[2px]' : ''}>
                {children}
            </div>
        </div>
    );
}
