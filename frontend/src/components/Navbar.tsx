import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut, Search, Map as MapIcon, PlusSquare, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-1.5 font-bold transition-all duration-300 relative py-1 ${isActive
            ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary-600 after:rounded-full'
            : 'text-slate-500 hover:text-primary-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-1/2 hover:after:h-[2px] hover:after:bg-primary-600/30'
        }`;

    return (
        <nav className="sticky top-0 z-[2000] glass premium-shadow px-6 py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                        <Home size={24} />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 tracking-tight">
                        EstatePro
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/properties" className={navLinkClass}>
                        <Search size={18} />
                        Browse
                    </NavLink>
                    <NavLink to="/map" className={navLinkClass}>
                        <MapIcon size={18} />
                        Map View
                    </NavLink>
                    <NavLink to="/agents" className={navLinkClass}>
                        <User size={18} />
                        Agents
                    </NavLink>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            {(user.role === 'agent' || user.role === 'admin') && (
                                <div className="flex items-center gap-6 mr-2">
                                    <NavLink to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className={navLinkClass}>
                                        <LayoutDashboard size={18} />
                                        {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                                    </NavLink>
                                    <NavLink to="/add-property" className="hidden sm:flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 hover:scale-105 transition-all font-bold text-sm shadow-lg shadow-primary-600/20 active:scale-95">
                                        <PlusSquare size={18} />
                                        List Property
                                    </NavLink>
                                </div>
                            )}
                            <NavLink to="/profile" className="flex items-center gap-2 text-slate-700 font-medium group">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold border-2 border-white premium-shadow group-hover:scale-110 transition-transform overflow-hidden">
                                    {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : user.name[0]}
                                </div>
                            </NavLink>
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-bold px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">
                                Login
                            </Link>
                            <Link to="/register" className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg shadow-slate-200 active:scale-95">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
                    <NavLink to="/properties" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <Search size={20} /> Browse Properties
                    </NavLink>
                    <NavLink to="/map" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <MapIcon size={20} /> Map View
                    </NavLink>
                    <NavLink to="/agents" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <User size={20} /> Find Agents
                    </NavLink>
                    <hr className="border-slate-100" />
                    {user ? (
                        <>
                            {(user.role === 'agent' || user.role === 'admin') && (
                                <>
                                    <NavLink to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                                        <LayoutDashboard size={20} /> {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                                    </NavLink>
                                    <NavLink to="/add-property" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                                        <PlusSquare size={20} /> List Property
                                    </NavLink>
                                </>
                            )}
                            <NavLink to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 font-bold text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={20} /> My Profile
                            </NavLink>
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 font-bold text-red-500 w-full text-left">
                                <LogOut size={20} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link to="/login" className="text-center w-full py-3 font-bold text-slate-600 rounded-xl hover:bg-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="text-center w-full py-3 font-bold bg-slate-900 text-white rounded-xl shadow-lg" onClick={() => setIsMobileMenuOpen(false)}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
