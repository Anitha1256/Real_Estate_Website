import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, Grid, List as ListIcon, Building } from 'lucide-react';
import PremiumSelect from '../components/PremiumSelect';
import propFallback from '../assets/prop_1.avif';

export default function Properties() {
    const [searchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        city: searchParams.get('city') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        propertyType: searchParams.get('propertyType') || '',
        bedrooms: searchParams.get('bedrooms') || ''
    });

    const propertyTypes = [
        { value: '', label: 'All Categories' },
        { value: 'apartment', label: 'Modern Apartment' },
        { value: 'house', label: 'Detached House' },
        { value: 'villa', label: 'Luxury Villa' },
        { value: 'penthouse', label: 'Elite Penthouse' },
        { value: 'condo', label: 'Urban Condo' }
    ];

    const bedroomOptions = [
        { value: '', label: 'Any Bedrooms' },
        { value: '1', label: '1+ Bedrooms' },
        { value: '2', label: '2+ Bedrooms' },
        { value: '3', label: '3+ Bedrooms' },
        { value: '4', label: '4+ Bedrooms' }
    ];

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchProperties = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/properties', { params: filters });
            setProperties(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-4"
                            >
                                <span className="w-8 h-[2px] bg-primary-600"></span>
                                Premium Catalog
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-black text-slate-900 mb-4 md:mb-6 leading-[1.1]"
                            >
                                Explore Our Exclusive <br />
                                <span className="text-primary-600">Property Portfolio</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed"
                            >
                                Discover the world's most luxurious residential listings, from contemporary urban lofts to sprawling coastal estates.
                            </motion.p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 w-full md:w-auto overflow-x-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 md:gap-3 px-5 py-3 md:px-8 md:py-4 rounded-[1.5rem] font-black uppercase text-[10px] md:text-xs tracking-widest transition-all whitespace-nowrap ${showFilters ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30' : 'bg-white text-slate-900 hover:bg-slate-100'}`}
                            >
                                <SlidersHorizontal size={16} strokeWidth={3} className="md:w-[18px] md:h-[18px]" />
                                Filters
                            </button>
                            <div className="flex gap-1">
                                <button onClick={() => setView('grid')} className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all ${view === 'grid' ? 'bg-white text-primary-600 shadow-sm shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} className="md:w-[22px] md:h-[22px]" /></button>
                                <button onClick={() => setView('list')} className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all ${view === 'list' ? 'bg-white text-primary-600 shadow-sm shadow-black/5' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={20} className="md:w-[22px] md:h-[22px]" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -20 }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                y: 0,
                                transitionEnd: { overflow: 'visible' }
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                y: -20,
                                transition: { overflow: { duration: 0 } },
                                overflow: 'hidden'
                            }}
                            className="mb-16 z-[60] relative"
                        >
                            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 premium-shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target City</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 group-focus-within:scale-110 transition-transform" size={20} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Los Angeles"
                                            className="w-full bg-slate-50 border-none py-4 pl-12 pr-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                            value={filters.city}
                                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <PremiumSelect
                                    label="Architecture"
                                    options={propertyTypes}
                                    value={filters.propertyType}
                                    onChange={(val) => setFilters({ ...filters, propertyType: val })}
                                    icon={Building}
                                />
                                <PremiumSelect
                                    label="Accommodation"
                                    options={bedroomOptions}
                                    value={filters.bedrooms}
                                    onChange={(val) => setFilters({ ...filters, bedrooms: val })}
                                    icon={Building}
                                />
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Max Investment</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            placeholder="No Limit"
                                            className="w-full bg-slate-50 border-none py-4 pl-10 pr-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 gap-4">
                        <div className="w-16 h-16 border-[6px] border-slate-100 border-t-primary-600 rounded-full animate-spin"></div>
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading Premium Collection</span>
                    </div>
                ) : (
                    <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" : "flex flex-col gap-8"}>
                        {properties.length > 0 ? properties.map((prop: any, i) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={prop._id}
                                className={`bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden premium-shadow group border border-slate-50 hover:border-primary-100 transition-all duration-500 ${view === 'list' ? 'flex flex-col lg:flex-row h-auto lg:h-72' : ''}`}
                            >
                                <div className={`relative overflow-hidden ${view === 'list' ? 'lg:w-[40%] h-64 lg:h-full' : 'h-64 md:h-72'}`}>
                                    <img src={prop.images[0] || propFallback} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                        <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">{prop.type}</div>
                                    </div>
                                    {view === 'grid' && (
                                        <div className="absolute bottom-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="bg-white text-primary-900 px-5 py-2.5 md:px-6 md:py-3 rounded-2xl font-black text-lg md:text-xl shadow-2xl ring-1 ring-black/5 leading-none">
                                                <span className="text-xs uppercase font-bold text-slate-400 block mb-1">Price</span>
                                                ${prop.price.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={`p-6 md:p-8 flex flex-col justify-between flex-1 ${view === 'list' ? 'lg:p-10' : ''}`}>
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className={`text-xl md:text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight ${view === 'list' ? 'md:text-3xl' : ''}`}>{prop.title}</h4>
                                            {view === 'list' && (
                                                <span className="text-2xl md:text-3xl font-black text-primary-600">${prop.price.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 font-medium flex items-center gap-2 mb-6 text-sm md:text-base">
                                            <MapPin size={18} className="text-primary-500" strokeWidth={2.5} />
                                            {prop.location.city}, {prop.location.address}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-slate-50 pt-6 md:pt-8">
                                        <div className="flex gap-4 md:gap-8 text-slate-900 font-black text-[10px] md:text-[11px] uppercase tracking-tighter">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-400 font-bold">Beds</span>
                                                <span className="text-base md:text-lg leading-none">{prop.features.bedrooms}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-400 font-bold">Baths</span>
                                                <span className="text-base md:text-lg leading-none">{prop.features.bathrooms}</span>
                                            </div>
                                            <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-slate-400 font-bold">Area</span>
                                                <span className="text-base md:text-lg leading-none">{prop.features.area} <span className="text-[9px] md:text-[10px] font-normal">FT²</span></span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/property/${prop._id}`}
                                            className={`rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center ${view === 'list' ? 'bg-primary-600 text-white px-6 py-3 md:px-10 md:py-4 hover:bg-primary-500 shadow-xl shadow-primary-600/20 active:scale-95' : 'bg-slate-900 text-white w-12 h-12 md:w-14 md:h-14 hover:bg-primary-600 hover:scale-110 shadow-xl active:scale-95'}`}
                                        >
                                            {view === 'list' ? 'View Property' : <Search size={22} strokeWidth={3} />}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border border-slate-100 premium-shadow">
                                <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-200">
                                    <Search size={48} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Catalog Empty</h3>
                                <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto">None of our elite listings match your current criteria. Try expanding your search horizons.</p>
                                <button
                                    onClick={() => setFilters({ city: '', minPrice: '', maxPrice: '', propertyType: '', bedrooms: '' })}
                                    className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-primary-600 transition-all shadow-2xl"
                                >
                                    Reset Selection
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
