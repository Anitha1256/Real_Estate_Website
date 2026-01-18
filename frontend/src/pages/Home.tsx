import { motion } from 'framer-motion';
import { Search, MapPin, Building, Key, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import PremiumSelect from '../components/PremiumSelect';
import homeImg from '../assets/home.avif';
import prop1 from '../assets/prop_1.avif';

export default function Home() {
    const navigate = useNavigate();
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('villa');
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProperties = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties`);
                // Only take the first 3 latest properties for the preview
                setProperties(data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLatestProperties();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.append('city', location);
        if (propertyType) params.append('propertyType', propertyType);
        navigate(`/properties?${params.toString()}`);
    };

    const propertyTypes = [
        { value: 'villa', label: 'Luxury Villa' },
        { value: 'penthouse', label: 'Modern Penthouse' },
        { value: 'estate', label: 'Elite Estate' }
    ];

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex flex-col justify-center pt-32 md:pt-0">
                <div className="absolute inset-0 z-0">
                    <img
                        src={homeImg}
                        alt="Hero House"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50"></div>
                </div>

                <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-md text-primary-400 font-bold text-xs md:text-sm tracking-widest uppercase"
                    >
                        Premium Real Estate Excellence
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-8xl font-black text-white mb-6 md:mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter"
                    >
                        Find Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-200">Modern Legacy</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4"
                    >
                        Access an exclusive portfolio of high-end properties designed for those who demand nothing but the extraordinary.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group bg-white/10 backdrop-blur-2xl p-2 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2 items-center max-w-4xl mx-auto ring-1 ring-white/10 hover:ring-white/30 transition-all duration-500 relative z-50 text-left"
                    >
                        <div className="flex-1 flex items-center gap-4 bg-white/5 rounded-3xl px-6 py-4 w-full group/input hover:bg-white/10 transition-colors">
                            <MapPin className="text-primary-400 group-hover/input:scale-110 transition-transform shrink-0" size={24} />
                            <div className="flex flex-col items-start w-full overflow-hidden">
                                <span className="text-[10px] uppercase font-black text-primary-300 tracking-widest">Location</span>
                                <input
                                    type="text"
                                    placeholder="Search by city..."
                                    className="w-full outline-none bg-transparent py-0.5 text-white font-bold placeholder:text-white/60 text-sm md:text-base"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <PremiumSelect
                                label="Property Type"
                                options={propertyTypes}
                                value={propertyType}
                                onChange={setPropertyType}
                                icon={Building}
                                dark={true}
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="bg-primary-600 text-white px-10 py-4 md:py-5 rounded-[1.5rem] md:rounded-[1.8rem] font-black hover:bg-primary-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95 w-full md:w-auto overflow-hidden relative group/btn"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                            <Search size={20} strokeWidth={3} />
                            <span className="uppercase tracking-wider text-xs md:text-sm whitespace-nowrap">Search</span>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { icon: Building, title: 'Wide Selection', desc: 'Over 10,000 premium properties across the most desirable locations.' },
                    { icon: Key, title: 'Secure Investment', desc: 'Verified property documentation and professional legal assistance.' },
                    { icon: Users, title: 'Expert Agents', desc: 'Connect with top-rated real estate professionals in your target area.' },
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="bg-white p-8 rounded-3xl premium-shadow border border-slate-100 group"
                    >
                        <div className="bg-primary-50 p-4 rounded-2xl w-fit text-primary-600 mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
                            <feature.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Popular Properties Preview (Static demo for now) */}
            <section className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Properties</h2>
                        <p className="text-slate-500 text-sm md:text-base">Handpicked listings specifically for you</p>
                    </div>
                    <Link to="/properties" className="text-primary-600 font-bold hover:underline self-end md:self-auto">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-[3rem] bg-slate-100 animate-pulse"></div>
                        ))
                    ) : properties.length > 0 ? (
                        properties.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[3rem] overflow-hidden premium-shadow group border border-slate-50 hover:border-primary-100 transition-all duration-500 flex flex-col h-full"
                            >
                                <div className="relative h-72 overflow-hidden shrink-0">
                                    <img
                                        src={item.images[0] || prop1}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <div className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Newly Added</div>
                                        <div className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Exclusive</div>
                                    </div>
                                    <div className="absolute bottom-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="bg-white text-primary-900 px-6 py-3 rounded-2xl font-black text-xl shadow-2xl ring-1 ring-black/5 leading-none">
                                            <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Price</span>
                                            ${item.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-100 px-2 py-0.5 rounded-md">{item.propertyType}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter border border-slate-100 px-2 py-0.5 rounded-md">For {item.type}</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">{item.title}</h4>
                                    <p className="text-slate-500 flex items-start gap-2 mb-6 font-medium">
                                        <MapPin size={16} className="text-primary-500 mt-1 shrink-0" />
                                        <span>{item.location.city}, {item.location.address}</span>
                                    </p>

                                    <div className="flex justify-between items-center pt-6 border-t border-slate-50 mt-auto">
                                        <div className="flex gap-5 text-slate-600 font-bold text-xs uppercase tracking-tighter">
                                            <div className="flex flex-col items-center gap-1 group/spec">
                                                <span className="text-slate-400 group-hover/spec:text-primary-500 transition-colors">Beds</span>
                                                <span className="text-lg">{item.features.bedrooms.toString().padStart(2, '0')}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="flex flex-col items-center gap-1 group/spec">
                                                <span className="text-slate-400 group-hover/spec:text-primary-500 transition-colors">Baths</span>
                                                <span className="text-lg">{item.features.bathrooms.toString().padStart(2, '0')}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100"></div>
                                            <div className="flex flex-col items-center gap-1 group/spec">
                                                <span className="text-slate-400 group-hover/spec:text-primary-500 transition-colors">Area</span>
                                                <span className="text-lg">{Math.round(item.features.area / 1000 * 10) / 10}k</span>
                                            </div>
                                        </div>
                                        <Link to={`/property/${item._id}`} className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110 shadow-xl active:scale-95 shrink-0">
                                            <Search size={20} strokeWidth={3} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold italic">No real listings found. Start by adding your first property!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
