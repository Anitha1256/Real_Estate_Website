import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, Building, Star, Award, Search, Users } from 'lucide-react';

interface Agent {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    about?: string;
    profileImage?: string;
    listingsCount?: number;
}

export default function Agents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/agents`);
                setAgents(data);
            } catch (error) {
                console.error('Failed to fetch agents:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-center md:justify-start gap-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-4"
                            >
                                <span className="w-8 h-[2px] bg-primary-600"></span>
                                Elite Network
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight"
                            >
                                Meet Our Professional <br />
                                <span className="text-primary-600 font-extrabold italic">Real Estate Partners</span>
                            </motion.h1>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-100 p-3 rounded-[2.5rem] flex items-center gap-2 max-w-md w-full border border-slate-200"
                        >
                            <div className="bg-white p-3 rounded-2xl shadow-sm"><Search className="text-primary-600" size={20} /></div>
                            <input
                                type="text"
                                placeholder="Search agents by name..."
                                className="bg-transparent border-none outline-none font-bold text-slate-900 w-full px-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] bg-white rounded-[3rem] animate-pulse border border-slate-100"></div>
                        ))}
                    </div>
                ) : filteredAgents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredAgents.map((agent, i) => (
                            <motion.div
                                key={agent._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-[3.5rem] p-8 border border-slate-100 premium-shadow hover:border-primary-100 transition-all duration-500 relative flex flex-col items-center text-center overflow-hidden"
                            >
                                {/* Role Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-primary-100">
                                        <Award size={12} strokeWidth={3} />
                                        Verified Agent
                                    </div>
                                </div>

                                {/* Profile Image */}
                                <div className="relative mb-8 mt-4">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 overflow-hidden ring-8 ring-slate-50 relative z-10">
                                        {agent.profileImage ? (
                                            <img src={agent.profileImage} alt={agent.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">{agent.name[0]}</div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-2xl border-4 border-white z-20 shadow-lg"></div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{agent.name}</h3>
                                <div className="flex items-center gap-1 text-primary-500 mb-6 font-bold text-xs">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-slate-400 ml-2">Elite Partner</span>
                                </div>

                                <p className="text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3 px-4 italic">
                                    "{agent.about || 'Passionate real estate professional dedicated to finding you the perfect home in the most exclusive neighborhoods.'}"
                                </p>

                                <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-50 p-4 rounded-3xl flex flex-col items-center gap-1 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                                        <Building className="text-primary-600" size={18} />
                                        <span className="text-[10px] font-black uppercase text-slate-400">Total Listings</span>
                                        <span className="text-xl font-black text-slate-900">{String(agent.listingsCount || 0).padStart(2, '0')}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-3xl flex flex-col items-center gap-1 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                                        <Users className="text-primary-600" size={18} />
                                        <span className="text-[10px] font-black uppercase text-slate-400">Experience</span>
                                        <span className="text-xl font-black text-slate-900">5+ Yrs</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 w-full">
                                    <Link
                                        to={`/agents/${agent._id}`}
                                        className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-primary-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        View Identity Profile
                                    </Link>
                                    <div className="flex gap-2">
                                        <a href={`tel:${agent.phone}`} className="flex-1 bg-white border border-slate-200 text-slate-900 p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center">
                                            <Phone size={18} />
                                        </a>
                                        <a href={`mailto:${agent.email}`} className="flex-1 bg-white border border-slate-200 text-slate-900 p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center">
                                            <Mail size={18} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[4rem] border border-slate-100 p-20 text-center premium-shadow">
                        <Users className="mx-auto text-slate-200 mb-6" size={64} strokeWidth={1} />
                        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Agent Not Found</h3>
                        <p className="text-slate-400 text-lg font-medium italic">We couldn't find any partners matching "{search}".</p>
                    </div>
                )}
            </div>
        </div>
    );
}
