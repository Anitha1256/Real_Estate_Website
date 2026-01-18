import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Upload, Plus, MapPin, Building, DollarSign, Info, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import PremiumSelect from '../components/PremiumSelect';

export default function EditProperty() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        type: 'sale',
        propertyType: 'house',
        location: { address: '', city: '', coordinates: { lat: 34.0522, lng: -118.2437 } },
        features: { bedrooms: '', bathrooms: '', area: '' }
    });

    const propertyTypes = [
        { value: 'house', label: 'Luxury House' },
        { value: 'apartment', label: 'Modern Apartment' },
        { value: 'villa', label: 'Premium Villa' },
        { value: 'penthouse', label: 'Elite Penthouse' },
        { value: 'condo', label: 'Urban Condo' }
    ];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5001/api/properties/${id}`);
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    type: data.type,
                    propertyType: data.propertyType,
                    location: data.location,
                    features: {
                        bedrooms: data.features.bedrooms.toString(),
                        bathrooms: data.features.bathrooms.toString(),
                        area: data.features.area.toString()
                    }
                });
                setPreviews(data.images);
            } catch (error) {
                toast.error('Failed to fetch property details');
                navigate('/dashboard');
            } finally {
                setFetching(false);
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files); // In edit mode, we replace for simplicity or just allow new ones
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('type', formData.type);
        data.append('propertyType', formData.propertyType);
        data.append('location', JSON.stringify(formData.location));
        data.append('features', JSON.stringify(formData.features));

        if (selectedFiles.length > 0) {
            selectedFiles.forEach(file => {
                data.append('images', file);
            });
        }

        try {
            await axios.put(`http://localhost:5001/api/properties/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            toast.success('Masterpiece updated successfully!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update property');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'user') return <div className="text-center py-20">Access Denied</div>;

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-16">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Back to Dashboard
                </button>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-4"
                >
                    <Sparkles size={16} />
                    Refinement Mode
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">Update Your <span className="text-primary-600 underline decoration-primary-200 underline-offset-8">Listing</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Property Title</label>
                            <input
                                type="text" required
                                value={formData.title}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Investment Value ($)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
                                <input
                                    type="number" required
                                    value={formData.price}
                                    className="w-full bg-slate-50 border-none py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900"
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Property Type</label>
                            <PremiumSelect
                                label="Listing Category"
                                options={propertyTypes}
                                value={formData.propertyType}
                                onChange={(val) => setFormData({ ...formData, propertyType: val })}
                                icon={Building}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                        <textarea
                            required rows={6}
                            value={formData.description}
                            className="w-full bg-slate-50 border-none p-6 rounded-[2rem] outline-none focus:ring-2 ring-primary-500/20 transition-all font-medium text-slate-600 resize-none leading-relaxed"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><Upload className="text-primary-600" size={24} /> Update Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ))}
                        <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all group">
                            <Plus size={32} className="text-slate-400 group-hover:text-primary-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-2">Replace All Photos</span>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400 font-medium italic">Uploading new photos will replace all existing property images.</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><MapPin className="text-primary-600" /> Geography</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                            <input
                                type="text" required
                                value={formData.location.city}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Precise Address</label>
                            <input
                                type="text" required
                                value={formData.location.address}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                            />
                        </div>
                    </div>
                    {/* Coordinates for Map */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Latitude</label>
                            <input
                                type="number" step="any" required
                                value={formData.location.coordinates?.lat || ''}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) } } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Longitude</label>
                            <input
                                type="number" step="any" required
                                value={formData.location.coordinates?.lng || ''}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) } } })}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><Info className="text-primary-600" /> Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        <div className="space-y-3 text-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bedrooms</label>
                            <input
                                type="number" required
                                value={formData.features.bedrooms}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, bedrooms: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3 text-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bathrooms</label>
                            <input
                                type="number" required
                                value={formData.features.bathrooms}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, bathrooms: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3 text-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area (sqft)</label>
                            <input
                                type="number" required
                                value={formData.features.area}
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, area: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-6 rounded-3xl font-bold text-xl hover:bg-primary-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={28} /> : <>Save Masterpiece Changes <Sparkles size={24} /></>}
                </button>
            </form>
        </div>
    );
}
