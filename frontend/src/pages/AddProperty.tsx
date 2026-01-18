import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Upload, Plus, MapPin, Building, DollarSign, Info, Loader2, Sparkles } from 'lucide-react';
import PremiumSelect from '../components/PremiumSelect';

export default function AddProperty() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
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

        selectedFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/properties`, data, {
                headers: {
                    Authorization: `Bearer ${user?.token} `
                }
            });
            toast.success('Property listed successfully with images!');
            navigate('/properties');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to list property');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'user') return <div className="text-center py-20">Access Denied</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-16">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-4"
                >
                    <Sparkles size={16} />
                    Agent Portal
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">List Your <span className="text-primary-600 underline decoration-primary-200 underline-offset-8">Masterpiece</span></h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">Showcase your property to our exclusive high-net-worth network with high-fidelity details and stunning visuals.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Property Title</label>
                            <input
                                type="text" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="e.g Luxury Modern Villa with Pool"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Investment Value ($)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 group-focus-within:scale-110 transition-transform" size={20} />
                                <input
                                    type="number" required
                                    className="w-full bg-slate-50 border-none py-4 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 placeholder:text-slate-300"
                                    placeholder="0.00"
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
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Compelling Description</label>
                        <textarea
                            required rows={6}
                            className="w-full bg-slate-50 border-none p-6 rounded-[2rem] outline-none focus:ring-2 ring-primary-500/20 transition-all font-medium text-slate-600 placeholder:text-slate-300 resize-none leading-relaxed"
                            placeholder="Tell us about the breathtaking features, the neighborhood, and the lifestyle this masterpiece offers..."
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><Upload className="text-primary-600" size={24} /> Visual Assets</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Plus className="rotate-45" size={16} />
                                </button>
                            </div>
                        ))}

                        {previews.length < 5 && (
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-primary-400 transition-all group">
                                <Plus className="text-slate-400 group-hover:text-primary-600 transition-colors" size={32} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Photo</span>
                                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Please upload up to 5 high-resolution images of the property. WebP or AVIF recommended.</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><MapPin className="text-primary-600" /> Geography</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                            <input
                                type="text" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="Beverly Hills"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Precise Address</label>
                            <input
                                type="text" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="123 Luxury Avenue"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Latitude</label>
                            <input
                                type="number" step="any" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="34.0522"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lat: parseFloat(e.target.value) } } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Longitude</label>
                            <input
                                type="number" step="any" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="-118.2437"
                                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, coordinates: { ...formData.location.coordinates, lng: parseFloat(e.target.value) } } })}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] premium-shadow border border-slate-100 space-y-10">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight"><Info className="text-primary-600" /> Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bedrooms</label>
                            <input
                                type="number" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl placeholder:text-slate-300"
                                placeholder="0"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, bedrooms: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bathrooms</label>
                            <input
                                type="number" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl placeholder:text-slate-300"
                                placeholder="0"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, bathrooms: e.target.value } })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Area (sqft)</label>
                            <input
                                type="number" required
                                className="w-full bg-slate-50 border-none py-4 px-6 rounded-2xl outline-none focus:ring-2 ring-primary-500/20 transition-all font-black text-slate-900 text-center text-xl placeholder:text-slate-300"
                                placeholder="0"
                                onChange={(e) => setFormData({ ...formData, features: { ...formData.features, area: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-6 rounded-3xl font-bold text-xl hover:bg-slate-900 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-70"
                >
                    {loading ? <Loader2 className="animate-spin" size={28} /> : <>List Property Now <Plus className="group-hover:rotate-90 transition-transform" size={24} /></>}
                </button>
            </form>
        </div>
    );
}
