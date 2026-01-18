import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Users, Building, MessageSquare, Calendar,
    Trash2, Shield, User, Mail, Phone, MapPin,
    Download, PieChart, BarChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, properties: 0, inquiries: 0, appointments: 0 });
    const [usersList, setUsersList] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'properties' | 'interactions' | 'reports'>('overview');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };

                const [usersRes, propsRes, inqRes, aptRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/users', config),
                    axios.get('http://localhost:5001/api/properties', config),
                    axios.get('http://localhost:5001/api/inquiries/admin', config),
                    axios.get('http://localhost:5001/api/appointments/admin', config)
                ]);

                setUsersList(usersRes.data);
                setProperties(propsRes.data);
                setInquiries(inqRes.data);
                setAppointments(aptRes.data);

                setStats({
                    users: usersRes.data.length,
                    properties: propsRes.data.length,
                    inquiries: inqRes.data.length,
                    appointments: aptRes.data.length
                });

            } catch (error) {
                console.error('Error fetching admin data', error);
                toast.error('Failed to load admin data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleDeleteUser = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete user ${name}?`)) return;
        try {
            await axios.delete(`http://localhost:5001/api/users/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setUsersList(usersList.filter(u => u._id !== id));
            toast.success('User removed');
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleDeleteProperty = async (id: string) => {
        if (!window.confirm('Delete this property?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/properties/${id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setProperties(properties.filter(p => p._id !== id));
            toast.success('Property removed');
        } catch (error) {
            toast.error('Failed to delete property');
        }
    };

    const downloadCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            toast.info('No data to export');
            return;
        }
        // Flatten objects if needed, simplified for now
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).map(val =>
            typeof val === 'string' ? `"${val}"` : JSON.stringify(val)
        ).join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-12 h-12 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div></div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-8 md:py-12 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 text-primary-400 font-bold uppercase tracking-widest text-xs mb-2">
                            <Shield size={16} /> Admin Portal
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">System Overview</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500' },
                        { label: 'Properties', value: stats.properties, icon: Building, color: 'text-green-500' },
                        { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'text-purple-500' },
                        { label: 'Appointments', value: stats.appointments, icon: Calendar, color: 'text-orange-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl premium-shadow border border-slate-100 flex items-center gap-4">
                            <div className={`p-4 rounded-2xl bg-slate-50 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 md:gap-6 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
                    {['overview', 'users', 'properties', 'interactions', 'reports'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-4 px-2 font-bold uppercase text-sm tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab ? 'text-slate-900 border-b-4 border-slate-900' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-[2.5rem] premium-shadow border border-slate-100 overflow-hidden overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                <tr>
                                    <th className="p-4 md:p-6 text-left">User</th>
                                    <th className="p-4 md:p-6 text-left">Role</th>
                                    <th className="p-4 md:p-6 text-left">Contact</th>
                                    <th className="p-4 md:p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {usersList.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 md:p-6 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0"><User size={20} /></div>
                                            {u.name}
                                        </td>
                                        <td className="p-4 md:p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-slate-900 text-white' :
                                                u.role === 'agent' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 md:p-6 text-sm text-slate-500">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-2"><Mail size={12} /> {u.email}</span>
                                                {u.phone && <span className="flex items-center gap-2"><Phone size={12} /> {u.phone}</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 md:p-6 text-right">
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-xl">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((prop) => (
                            <div key={prop._id} className="bg-white p-4 rounded-3xl border border-slate-100 premium-shadow group">
                                <div className="h-48 rounded-2xl overflow-hidden mb-4 relative">
                                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <button
                                        onClick={() => handleDeleteProperty(prop._id)}
                                        className="absolute top-2 right-2 bg-white/90 p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 truncate">{prop.title}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin size={12} /> {prop.location.city}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                                        <User size={24} className="text-slate-300 translate-y-1" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">{prop.agent?.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(activeTab === 'interactions' || activeTab === 'overview') && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Inquiries */}
                        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MessageSquare size={20} className="text-purple-500" /> Recent Inquiries
                            </h3>
                            <div className="space-y-6">
                                {inquiries.slice(0, 5).map(inq => (
                                    <div key={inq._id} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 bg-purple-50 rounded-full flex-shrink-0 flex items-center justify-center text-purple-500 font-bold">
                                            {inq.user?.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{inq.user?.name} <span className="text-slate-400 font-normal">inquired about</span> {inq.property?.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 italic">"{inq.message.substring(0, 50)}..."</p>
                                            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                                Agent: {inq.agent?.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-orange-500" /> Recent Appointments
                            </h3>
                            <div className="space-y-6">
                                {appointments.slice(0, 5).map(apt => (
                                    <div key={apt._id} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 bg-orange-50 rounded-full flex-shrink-0 flex items-center justify-center text-orange-500 font-bold">
                                            {apt.user?.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{apt.property?.title}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] px-2 rounded-full font-black uppercase tracking-widest border ${apt.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    apt.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                    }`}>{apt.status}</span>
                                                <span className="text-xs text-slate-400">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                                Agent: {apt.agent?.name}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Tab Content */}
                {activeTab === 'reports' && (
                    <div className="space-y-8">
                        {/* Download Section */}
                        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Download size={20} className="text-slate-400" /> Export Data
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <button onClick={() => downloadCSV(usersList, 'users')} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all font-bold text-slate-600 flex items-center justify-between group">
                                    Users Data <Download size={16} className="text-slate-400 group-hover:text-primary-600" />
                                </button>
                                <button onClick={() => downloadCSV(properties, 'properties')} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all font-bold text-slate-600 flex items-center justify-between group">
                                    Properties Data <Download size={16} className="text-slate-400 group-hover:text-primary-600" />
                                </button>
                                <button onClick={() => downloadCSV(inquiries, 'inquiries')} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all font-bold text-slate-600 flex items-center justify-between group">
                                    Inquiries Log <Download size={16} className="text-slate-400 group-hover:text-primary-600" />
                                </button>
                                <button onClick={() => downloadCSV(appointments, 'appointments')} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all font-bold text-slate-600 flex items-center justify-between group">
                                    Appointments Log <Download size={16} className="text-slate-400 group-hover:text-primary-600" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* User Demographics */}
                            <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <PieChart size={20} className="text-blue-500" /> User Roles Breakdown
                                </h3>
                                <div className="space-y-4">
                                    {['user', 'agent', 'admin'].map(role => {
                                        const count = usersList.filter(u => u.role === role).length;
                                        const percentage = Math.round((count / usersList.length) * 100) || 0;
                                        return (
                                            <div key={role}>
                                                <div className="flex justify-between text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">
                                                    <span>{role}s</span>
                                                    <span>{count} ({percentage}%)</span>
                                                </div>
                                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${role === 'admin' ? 'bg-slate-900' : role === 'agent' ? 'bg-primary-500' : 'bg-blue-400'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Property Breakdown */}
                            <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <BarChart size={20} className="text-green-500" /> Property Overview
                                </h3>
                                <div className="space-y-4">
                                    {/* Calculated Top Cities/Types */}
                                    {(() => {
                                        const types = properties.reduce((acc: any, curr) => {
                                            acc[curr.propertyType] = (acc[curr.propertyType] || 0) + 1;
                                            return acc;
                                        }, {});
                                        return Object.entries(types).map(([type, count]: any) => {
                                            const percentage = Math.round((count / properties.length) * 100) || 0;
                                            return (
                                                <div key={type}>
                                                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">
                                                        <span>{type}</span>
                                                        <span>{count}</span>
                                                    </div>
                                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full bg-green-500" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
