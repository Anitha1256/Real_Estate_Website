import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Bed, Bath, Move, CheckCircle2, Phone, Mail, Send, Loader2, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import prop1 from '../assets/prop_1.avif';
import prop2 from '../assets/prop_2.avif';
import prop3 from '../assets/prop_3.avif';

export default function PropertyDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'inquiry' | 'schedule'>('inquiry');
    const [appointmentDate, setAppointmentDate] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/properties/${id}`);
                setProperty(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.info('Please login to send inquiry');
        setSending(true);
        try {
            await axios.post('http://localhost:5001/api/inquiries', {
                propertyId: id,
                message,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Inquiry sent successfully!');
            setMessage('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send inquiry');
        } finally {
            setSending(false);
        }
    };

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return toast.info('Please login to schedule a viewing');
        if (!appointmentDate) return toast.warning('Please select a date and time');
        setSending(true);
        try {
            await axios.post('http://localhost:5001/api/appointments', {
                propertyId: id,
                appointmentDate,
                notes: message,
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Viewing scheduled successfully!');
            setMessage('');
            setAppointmentDate('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to schedule viewing');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!property) return <div className="text-center py-20">Property not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-8 md:space-y-12">
                    {/* Gallery */}
                    <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px] md:h-[600px] premium-shadow group">
                        <motion.div
                            layoutId="main-img"
                            onClick={() => setSelectedImage(property.images[0] || prop1)}
                            className="lg:col-span-2 h-full cursor-pointer relative overflow-hidden"
                        >
                            <img src={property.images[0] || prop1} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white scale-110 group-hover:scale-100 duration-500">
                                <Search size={48} strokeWidth={1} />
                            </div>
                        </motion.div>
                        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
                            <div onClick={() => setSelectedImage(property.images[1] || prop2)} className="cursor-pointer overflow-hidden rounded-[2rem] relative">
                                <img src={property.images[1] || prop2} alt="1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div onClick={() => setSelectedImage(property.images[2] || prop3)} className="cursor-pointer overflow-hidden rounded-[2rem] relative">
                                <img src={property.images[2] || prop3} alt="2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <span className="bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold uppercase mb-4 inline-block">{property.propertyType} • For {property.type}</span>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{property.title}</h1>
                            <p className="text-base md:text-xl text-slate-500 flex items-center gap-2"><MapPin className="text-primary-600 shrink-0" size={20} /> {property.location.address}, {property.location.city}</p>
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 md:gap-0 border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest md:mb-1">Price</p>
                            <p className="text-3xl md:text-5xl font-black text-primary-600">${property.price.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-6 p-6 md:p-8 bg-white rounded-[2rem] border border-slate-100 premium-shadow">
                        <div className="text-center group">
                            <div className="bg-slate-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                <Bed size={24} className="md:w-8 md:h-8" />
                            </div>
                            <p className="text-xl md:text-2xl font-bold">{property.features.bedrooms}</p>
                            <p className="text-xs md:text-base text-slate-500 font-medium">Bedrooms</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-slate-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                <Bath size={24} className="md:w-8 md:h-8" />
                            </div>
                            <p className="text-xl md:text-2xl font-bold">{property.features.bathrooms}</p>
                            <p className="text-xs md:text-base text-slate-500 font-medium">Bathrooms</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-slate-50 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                                <Move size={24} className="md:w-8 md:h-8" />
                            </div>
                            <p className="text-xl md:text-2xl font-bold">{property.features.area}</p>
                            <p className="text-xs md:text-base text-slate-500 font-medium">Sq Ft</p>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 premium-shadow">
                        <h3 className="text-3xl font-bold mb-6">Description</h3>
                        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                            {property.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="sticky top-28 p-8 bg-slate-900 text-white rounded-[2.5rem] premium-shadow border border-slate-800">
                        <h3 className="text-2xl font-bold mb-8">Professional Agent</h3>
                        <Link to={`/agents/${property.agent?._id}`} className="flex items-center gap-4 mb-8 group hover:bg-white/5 p-3 rounded-2xl transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-slate-700 flex items-center justify-center text-3xl font-bold overflow-hidden border-2 border-slate-700">
                                {property.agent?.profileImage ? <img src={property.agent.profileImage} className="w-full h-full object-cover" /> : property.agent?.name[0]}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold group-hover:text-primary-400 transition-colors">{property.agent?.name}</h4>
                                <p className="text-slate-400 text-sm flex items-center gap-1"><CheckCircle2 size={14} className="text-primary-400" /> Verified Agent</p>
                            </div>
                        </Link>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="bg-white/10 p-2.5 rounded-xl"><Phone size={18} /></div>
                                <span className="font-medium">{property.agent?.phone || 'No contact phone provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="bg-white/10 p-2.5 rounded-xl"><Mail size={18} /></div>
                                <span className="font-medium">{property.agent?.email}</span>
                            </div>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
                            <button
                                onClick={() => setActiveTab('inquiry')}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'inquiry' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Send Inquiry
                            </button>
                            <button
                                onClick={() => setActiveTab('schedule')}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'schedule' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Schedule Viewing
                            </button>
                        </div>

                        <form onSubmit={activeTab === 'inquiry' ? handleInquiry : handleSchedule} className="space-y-4">
                            <h4 className="font-bold text-lg mb-4">
                                {activeTab === 'inquiry' ? 'Request Information' : 'Book a Tour'}
                            </h4>

                            {activeTab === 'schedule' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary-500 text-white transition-all [color-scheme:dark]"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                    {activeTab === 'inquiry' ? 'Message' : 'Notes for Agent'}
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder={activeTab === 'inquiry' ? "I'm interested in this property..." : "Any specific things you want to see?"}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary-500 text-white transition-all resize-none placeholder:text-slate-500"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button
                                disabled={sending}
                                className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {sending ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {activeTab === 'inquiry' ? 'Send Inquiry' : 'Schedule Viewing'}
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
                            >
                                <X size={40} strokeWidth={1} />
                            </motion.button>

                            <motion.img
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                src={selectedImage}
                                className="max-w-full max-h-full rounded-[2.5rem] shadow-2xl object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 overflow-x-auto no-scrollbar p-4 max-w-7xl">
                                {property.images.map((img: string, idx: number) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(img);
                                        }}
                                        className={`w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl cursor-pointer border-2 transition-all ${selectedImage === img ? 'border-primary-500 scale-110 shadow-lg shadow-primary-500/20' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
