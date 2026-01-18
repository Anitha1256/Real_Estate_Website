import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Building, Star, Award, ChevronLeft, LayoutGrid, List } from 'lucide-react';
import propFallback from '../assets/prop_1.avif';

interface Agent {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    about?: string;
    profileImage?: string;
}

interface Property {
    _id: string;
    title: string;
    price: number;
    location: { city: string; address: string };
    images: string[];
    propertyType: string;
    type: string;
    features: { bedrooms: number; bathrooms: number; area: number };
}

export default function AgentProfile() {
    const { id } = useParams();
    const [agent, setAgent] = useState<Agent | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const [agentRes, propertiesRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/users/agents/${id}`),
                    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties?agentId=${id}`)
                ]);
                setAgent(agentRes.data);
                setProperties(propertiesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgentData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            <div className="w-16 h-16 border-[6px] border-slate-100 border-t-primary-600 rounded-full animate-spin"></div>
            <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Compiling Professional Data</span>
        </div>
    );

    if (!agent) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="bg-white p-20 rounded-[4rem] border border-slate-100 premium-shadow">
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Identity Not Found</h3>
                <Link to="/agents" className="inline-block bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-primary-600 transition-all shadow-2xl">Return to Network</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/agents" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to All Agents
                    </Link>
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={20} /></button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Profile Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[3.5rem] p-10 border border-slate-100 premium-shadow relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-32 bg-slate-900"></div>

                        <div className="relative z-10 text-center flex flex-col items-center">
                            <div className="w-40 h-40 rounded-[3rem] bg-slate-800 border-[10px] border-white overflow-hidden shadow-2xl mb-6 mt-6">
                                {agent.profileImage ? (
                                    <img src={agent.profileImage} alt={agent.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-black">{agent.name[0]}</div>
                                )}
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{agent.name}</h2>
                            <div className="flex items-center gap-2 text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] mb-8 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100">
                                <Award size={14} />
                                Platinum Partner
                            </div>

                            <p className="text-slate-500 font-medium mb-10 leading-relaxed italic text-lg px-2">
                                "{agent.about || 'Specializing in high-value residential assets and providing unparalleled client advisory services in the luxury sector.'}"
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full mb-10">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-1 group/stat hover:bg-primary-50 transition-colors">
                                    <Building className="text-primary-600 group-hover/stat:scale-110 transition-transform" size={20} />
                                    <span className="text-[10px] items-center font-black uppercase text-slate-400">Inventory</span>
                                    <span className="text-2xl font-black text-slate-900">{properties.length.toString().padStart(2, '0')}</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center gap-1 group/stat hover:bg-primary-50 transition-colors">
                                    <Star className="text-primary-600 group-hover/stat:scale-110 transition-transform" size={20} fill="currentColor" />
                                    <span className="text-[10px] items-center font-black uppercase text-slate-400">Rating</span>
                                    <span className="text-2xl font-black text-slate-900">5.0</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <a href={`tel:${agent.phone || '#'}`} className="flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                                    <Phone size={18} />
                                    {agent.phone || 'Private Number'}
                                </a>
                                <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-3 bg-white border-2 border-slate-900 text-slate-900 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95">
                                    <Mail size={18} />
                                    Send Identity Email
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[3rem] p-8 border border-slate-100 premium-shadow"
                    >
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Agent Credentials</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><Award size={20} /></div>
                                <div>
                                    <div className="text-sm font-black text-slate-900">Luxury Specialist</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Certified Expert 2024</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><MapPin size={20} /></div>
                                <div>
                                    <div className="text-sm font-black text-slate-900">Local Area Advisor</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Specializing in Downtown</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Properties Catalog */}
                <div className="lg:col-span-8">
                    <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-10 px-2">
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Official Portfolio</h3>
                            <p className="text-slate-500 font-medium italic text-lg opacity-80">Managing {properties.length} elite residential listings</p>
                        </div>
                        <div className="h-[2px] flex-1 bg-slate-200 ml-6 rounded-full hidden md:block"></div>
                    </div>

                    {properties.length > 0 ? (
                        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-8"}>
                            {properties.map((prop, i) => (
                                <motion.div
                                    key={prop._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`bg-white rounded-[3rem] overflow-hidden premium-shadow group border border-slate-50 hover:border-primary-100 transition-all duration-500 ${view === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                                >
                                    <div className={`relative overflow-hidden ${view === 'list' ? 'md:w-[45%] h-64 md:h-72' : 'h-72'}`}>
                                        <img src={prop.images[0] || propFallback} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                        <div className="absolute top-6 left-6">
                                            <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{prop.type}</div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col justify-between flex-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight truncate px-0">{prop.title}</h4>
                                            </div>
                                            <p className="text-slate-500 font-medium flex items-center gap-2 mb-6">
                                                <MapPin size={16} className="text-primary-500" strokeWidth={2.5} />
                                                {prop.location.city}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center border-t border-slate-50 pt-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-primary-600 font-black text-xl">${prop.price.toLocaleString()}</span>
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Market Value</span>
                                            </div>
                                            <Link
                                                to={`/property/${prop._id}`}
                                                className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-all active:scale-95 shadow-xl"
                                            >
                                                <Building size={22} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-40 text-center bg-white rounded-[4rem] border border-slate-100 premium-shadow">
                            <Building className="mx-auto text-slate-100 mb-8" size={64} strokeWidth={1} />
                            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">No Active Listings</h3>
                            <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto">This partner's portfolio is currently undergoing refinement. Check back soon for new opportunities.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
