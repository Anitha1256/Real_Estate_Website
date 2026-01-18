import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation2, Building, Heart, ArrowRight, Plus } from 'lucide-react';
import propFallback from '../assets/prop_1.avif';

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to handle map flies/centering
function MapFlyTo({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14, { duration: 1.5 });
    }, [center, map]);
    return null;
}

// Custom component for Map Controls (Zoom & Search) to access map instance
function MapActionControls({ onSearch }: { onSearch: () => void }) {
    const map = useMap();

    // Prevent clicks from propagating to the map
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            <div className="absolute top-20 right-4 md:top-8 md:right-8 flex flex-col gap-2 z-[400]" onClick={stopPropagation} onMouseDown={stopPropagation}>
                <div className="bg-white/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/20 flex flex-col gap-1">
                    <button
                        onClick={() => map.zoomIn()}
                        className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-900 transition-all shadow-sm active:scale-90"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                    <div className="h-px bg-slate-200/50 mx-2"></div>
                    <button
                        onClick={() => map.zoomOut()}
                        className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-900 transition-all shadow-sm active:scale-90"
                    >
                        <span className="font-black text-xl leading-none">-</span>
                    </button>
                </div>
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] w-auto whitespace-nowrap" onClick={stopPropagation} onMouseDown={stopPropagation}>
                <button
                    onClick={onSearch}
                    className="bg-primary-600 text-white px-5 py-3 md:px-6 md:py-3 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary-600/30 flex items-center gap-3 hover:bg-primary-500 transition-all active:scale-95"
                >
                    <Search size={14} strokeWidth={3} /> Re-search Area
                </button>
            </div>
        </>
    );
}

export default function MapPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProperty, setActiveProperty] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([34.0522, -118.2437]); // Default LA

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties`);
            setProperties(data);
            if (data.length > 0 && data[0].location?.coordinates?.lat) {
                // If it's the initial load (properties empty) or explicit re-search, centering is okay.
                // To avoid jumping during interaction, ideally we'd check if map is already moved.
                // For this quick fix, I'll restore centering to ensure properties are seen.
                setMapCenter([data[0].location.coordinates.lat, data[0].location.coordinates.lng]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearchArea = () => {
        fetchProperties();
    };

    const handlePropertyHover = (prop: any) => {
        if (prop.location?.coordinates?.lat) {
            setActiveProperty(prop);
            setMapCenter([prop.location.coordinates.lat, prop.location.coordinates.lng]);
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] w-full flex flex-col-reverse md:flex-row overflow-hidden bg-slate-50">
            {/* Sidebar List */}
            <div className="w-full md:w-[450px] h-[45vh] md:h-full flex flex-col bg-white border-r border-slate-200 shadow-2xl z-10 relative">
                <div className="p-4 md:p-8 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-primary-600 font-bold text-[10px] tracking-widest uppercase mb-2"
                    >
                        <Navigation2 size={14} className="fill-primary-600 rotate-45" /> Ready to Explore
                    </motion.div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight mb-2">Neighborhood Explorer</h2>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">Discover {properties.length} exclusive listings in this area.</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50/30">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 rounded-[2rem] animate-pulse"></div>
                        ))
                    ) : properties.length > 0 ? (
                        properties.map((prop: any, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={prop._id}
                                onMouseEnter={() => handlePropertyHover(prop)}
                                className={`group bg-white rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer ${activeProperty?._id === prop._id ? 'border-primary-500 shadow-2xl shadow-primary-500/10 -translate-y-1' : 'border-slate-100 hover:border-primary-200'}`}
                            >
                                <div className="h-32 md:h-48 relative overflow-hidden">
                                    <img src={prop.images[0] || propFallback} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{prop.type}</div>
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl shadow-lg ring-1 ring-black/5">
                                        <p className="text-primary-600 font-black text-sm md:text-lg leading-none">${prop.price.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-black text-slate-900 text-lg md:text-xl truncate pr-4">{prop.title}</h3>
                                        <button className="text-slate-300 hover:text-red-500 transition-colors"><Heart size={20} /></button>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mb-4">
                                        <MapPin size={14} className="text-primary-500" /> {prop.location.city}, {prop.location.address}
                                    </p>
                                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                        <div className="flex gap-2 md:gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                            <span>{prop.features.bedrooms} Beds</span>
                                            <span>{prop.features.bathrooms} Baths</span>
                                            <span>{prop.features.area} FT²</span>
                                        </div>
                                        <Link
                                            to={`/property/${prop._id}`}
                                            className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary-600 transition-all"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <Building className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-slate-400 font-bold">No properties found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 w-full h-[55vh] md:h-full relative">
                <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapFlyTo center={mapCenter} />
                    {properties.map((prop: any) => prop.location?.coordinates?.lat ? (
                        <Marker
                            key={prop._id}
                            position={[prop.location.coordinates.lat, prop.location.coordinates.lng]}
                            eventHandlers={{
                                click: () => setActiveProperty(prop)
                            }}
                        >
                            <Popup closeButton={false} className="premium-popup">
                                <div className="w-64 overflow-hidden rounded-[1.5rem]">
                                    <img src={prop.images[0] || propFallback} className="w-full h-32 object-cover" />
                                    <div className="p-4 bg-white">
                                        <h4 className="font-black text-slate-900 mb-1 truncate">{prop.title}</h4>
                                        <p className="text-primary-600 font-black text-lg">${prop.price.toLocaleString()}</p>
                                        <Link
                                            to={`/property/${prop._id}`}
                                            className="mt-3 block text-center bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all"
                                        >
                                            View Listing
                                        </Link>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null)}

                    {/* Map Controls */}
                    <MapActionControls onSearch={handleSearchArea} />
                </MapContainer>
            </div>
        </div>
    );
}
