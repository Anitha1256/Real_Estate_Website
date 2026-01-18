import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Building, Plus, Edit3, Trash2, MapPin, LayoutDashboard, ListFilter, Search, AlertCircle, MessageSquare, Calendar, User, Phone, Mail, Check, X, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

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

interface Inquiry {
    _id: string;
    property: { title: string; images: string[] };
    user: { name: string; email: string; phone?: string };
    message: string;
    createdAt: string;
}

interface Appointment {
    _id: string;
    property: { title: string; images: string[] };
    user: { name: string; email: string; phone?: string };
    appointmentDate: string;
    notes: string;
    status: 'pending' | 'confirmed' | 'canceled' | 'completed';
}

export default function Dashboard() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'inventory' | 'inquiries' | 'appointments'>('inventory');

    // Reply State
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/appointments/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            // Update local state
            setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status: data.status } : apt));
            toast.success(`Appointment ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleReply = async (id: string) => {
        if (!replyMessage.trim()) return;

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/inquiries/${id}/reply`,
                { message: replyMessage },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            toast.success('Reply sent to customer');
            setReplyingTo(null);
            setReplyMessage('');
        } catch (error) {
            toast.error('Failed to send reply');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'inventory') {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties?agentId=${user?._id}`);
                    setProperties(data);
                } else if (activeTab === 'inquiries') {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/inquiries/agent`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    });
                    setInquiries(data);
                } else if (activeTab === 'appointments') {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/appointments/agent`, {
                        headers: { Authorization: `Bearer ${user?.token}` }
                    });
                    setAppointments(data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchData();
        }
    }, [user, activeTab]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you absolutely sure you want to remove this masterpiece? This action cannot be undone.')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setProperties(properties.filter(p => p._id !== id));
            toast.success('Listing removed from inventory');
        } catch (error) {
            toast.error('Failed to remove listing');
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (user?.role === 'user') return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white p-16 rounded-[4rem] text-center premium-shadow max-w-lg border border-slate-100">
                <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Agent Access Restricted</h2>
                <p className="text-slate-500 font-medium mb-8 italic">This terminal is reserved for registered real estate partners and administration.</p>
                <Link to="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-600 transition-all">Return to Home</Link>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-4">
                                <LayoutDashboard size={16} />
                                Intelligence Hub
                            </div>
                            <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">Agent <span className="text-primary-600">Dashboard</span></h1>
                            <p className="text-slate-500 font-medium italic">Manage your assets and client communications</p>
                        </div>
                        <div className="flex gap-4">
                            <Link to="/add-property" className="bg-primary-600 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-2xl shadow-primary-600/20 flex items-center gap-3 active:scale-95">
                                <Plus size={20} strokeWidth={3} />
                                List Asset
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                {/* Tabs */}
                <div className="flex gap-6 mb-12 border-b border-slate-200 pb-1">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`pb-4 px-2 font-bold uppercase text-sm tracking-widest transition-all ${activeTab === 'inventory' ? 'text-primary-600 border-b-4 border-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`pb-4 px-2 font-bold uppercase text-sm tracking-widest transition-all flex items-center gap-2 ${activeTab === 'inquiries' ? 'text-primary-600 border-b-4 border-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Inquiries <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{inquiries.length > 0 ? inquiries.length : ''}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`pb-4 px-2 font-bold uppercase text-sm tracking-widest transition-all flex items-center gap-2 ${activeTab === 'appointments' ? 'text-primary-600 border-b-4 border-primary-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        Appointments <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{appointments.length > 0 ? appointments.length : ''}</span>
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* INVENTORY TAB */}
                        {activeTab === 'inventory' && (
                            <>
                                <div className="flex flex-col md:flex-row gap-4 mb-10">
                                    <div className="flex-1 bg-white p-3 rounded-3xl premium-shadow border border-slate-100 flex items-center gap-3">
                                        <div className="bg-slate-50 p-3 rounded-2xl text-primary-600"><Search size={20} /></div>
                                        <input
                                            type="text"
                                            placeholder="Search your listings..."
                                            className="bg-transparent border-none outline-none font-bold text-slate-900 w-full px-2"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {filteredProperties.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredProperties.map((prop) => (
                                            <motion.div
                                                key={prop._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-[3.5rem] overflow-hidden premium-shadow group border border-slate-50 hover:border-primary-100 transition-all duration-500"
                                            >
                                                <div className="relative h-60 overflow-hidden">
                                                    <img
                                                        src={prop.images[0] || 'https://via.placeholder.com/600'}
                                                        alt={prop.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute top-6 left-6">
                                                        <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{prop.propertyType}</div>
                                                    </div>
                                                </div>

                                                <div className="p-8">
                                                    <h3 className="text-2xl font-black text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors uppercase tracking-tighter">{prop.title}</h3>
                                                    <p className="text-slate-500 font-medium flex items-center gap-2 mb-8 italic truncate">
                                                        <MapPin size={16} className="text-primary-500" />
                                                        {prop.location.city}, {prop.location.address}
                                                    </p>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Link
                                                            to={`/edit-property/${prop._id}`}
                                                            className="flex-1 bg-slate-50 border border-slate-100 text-slate-900 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100 transition-all"
                                                        >
                                                            <Edit3 size={14} />
                                                            Update
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(prop._id)}
                                                            className="flex-1 bg-slate-50 border border-slate-100 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[4rem] border border-slate-100 p-24 text-center premium-shadow">
                                        <Building className="mx-auto text-slate-100 mb-8" size={80} strokeWidth={1} />
                                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Inventory Empty</h3>
                                        <p className="text-slate-400 text-lg font-medium italic max-w-sm mx-auto mb-10">You currently have no masterpieces listed.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* INQUIRIES TAB */}
                        {activeTab === 'inquiries' && (
                            <div className="grid grid-cols-1 gap-6">
                                {inquiries.length > 0 ? inquiries.map((inquiry) => (
                                    <motion.div
                                        key={inquiry._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100 flex flex-col md:flex-row gap-8 items-start hover:border-primary-100 transition-colors"
                                    >
                                        <div className="w-full md:w-64 flex-shrink-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-primary-50 p-3 rounded-2xl text-primary-600"><User size={20} /></div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{inquiry.user.name}</h4>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm text-slate-500">
                                                <div className="flex items-center gap-2"><Mail size={14} /> {inquiry.user.email}</div>
                                                {inquiry.user.phone && <div className="flex items-center gap-2"><Phone size={14} /> {inquiry.user.phone}</div>}
                                            </div>

                                            {/* Reply Button */}
                                            <button
                                                onClick={() => {
                                                    setReplyingTo(replyingTo === inquiry._id ? null : inquiry._id);
                                                    setReplyMessage('');
                                                }}
                                                className="mt-6 w-full py-3 rounded-xl border border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 flex items-center justify-center gap-2"
                                            >
                                                {replyingTo === inquiry._id ? <X size={14} /> : <MessageSquare size={14} />}
                                                {replyingTo === inquiry._id ? 'Cancel Reply' : 'Reply'}
                                            </button>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-1 block">Inquiry For</span>
                                                <h3 className="text-xl font-bold text-slate-900">{inquiry.property.title}</h3>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-3xl text-slate-600 italic leading-relaxed border border-slate-100 mb-4">
                                                <MessageSquare size={16} className="text-primary-400 mb-2" />
                                                "{inquiry.message}"
                                            </div>

                                            {/* Reply Area */}
                                            {replyingTo === inquiry._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="overflow-hidden"
                                                >
                                                    <textarea
                                                        className="w-full bg-white border border-slate-200 rounded-2xl p-4 outline-none focus:border-primary-500 transition-colors font-medium text-slate-700 resize-none h-32 mb-3"
                                                        placeholder="Write your reply here..."
                                                        value={replyMessage}
                                                        onChange={(e) => setReplyMessage(e.target.value)}
                                                    ></textarea>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() => handleReply(inquiry._id)}
                                                            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-primary-600/20 hover:bg-slate-900 transition-all flex items-center gap-2"
                                                        >
                                                            Send Reply <Check size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                                        <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-500 font-medium">No inquiries received yet.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* APPOINTMENTS TAB */}
                        {activeTab === 'appointments' && (
                            <div className="grid grid-cols-1 gap-6">
                                {appointments.length > 0 ? appointments.map((apt) => (
                                    <motion.div
                                        key={apt._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100 flex flex-col md:flex-row gap-8 items-start hover:border-primary-100 transition-colors"
                                    >
                                        <div className="w-full md:w-64 flex-shrink-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-3 rounded-2xl ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                                                    apt.status === 'canceled' ? 'bg-red-50 text-red-600' :
                                                        'bg-purple-50 text-purple-600'
                                                    }`}>
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{new Date(apt.appointmentDate).toLocaleDateString()}</h4>
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm text-slate-500">
                                                <div className="flex items-center gap-2"><User size={14} /> {apt.user.name}</div>
                                                <div className="flex items-center gap-2"><Mail size={14} /> {apt.user.email}</div>
                                                {apt.user.phone && <div className="flex items-center gap-2"><Phone size={14} /> {apt.user.phone}</div>}
                                            </div>

                                            {/* Status Badge */}
                                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                                                style={{
                                                    backgroundColor: apt.status === 'confirmed' ? '#f0fdf4' : apt.status === 'canceled' ? '#fef2f2' : '#fff7ed',
                                                    color: apt.status === 'confirmed' ? '#16a34a' : apt.status === 'canceled' ? '#dc2626' : '#ea580c',
                                                    borderColor: apt.status === 'confirmed' ? '#bbf7d0' : apt.status === 'canceled' ? '#fecaca' : '#fed7aa',
                                                }}
                                            >
                                                {apt.status === 'confirmed' ? <Check size={12} /> : apt.status === 'canceled' ? <X size={12} /> : <Clock size={12} />}
                                                {apt.status}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1 block">Viewing Request For</span>
                                                    <h3 className="text-xl font-bold text-slate-900">{apt.property.title}</h3>
                                                </div>

                                                {/* Actions */}
                                                {apt.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                                            className="bg-green-500 text-white p-2 rounded-xl hover:bg-green-600 transition-colors shadow-lg active:scale-95" title="Confirm"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(apt._id, 'canceled')}
                                                            className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-lg active:scale-95" title="Decline"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-3xl text-slate-600 italic leading-relaxed border border-slate-100">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Notes</span>
                                                "{apt.notes || 'No notes provided'}"
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                                        <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                                        <p className="text-slate-500 font-medium">No viewing requests yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
