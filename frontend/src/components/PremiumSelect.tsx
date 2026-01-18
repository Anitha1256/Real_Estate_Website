import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface PremiumSelectProps {
    label: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    icon: React.ElementType;
    dark?: boolean;
}

export default function PremiumSelect({ label, options, value, onChange, icon: Icon, dark = false }: PremiumSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || { label: 'Select...', value: '' };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative flex-1 w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-4 rounded-3xl px-6 py-4 cursor-pointer transition-all duration-300 group/select ${dark
                    ? 'bg-white/5 hover:bg-white/10 ring-1 ring-white/5'
                    : 'bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200'
                    }`}
            >
                <Icon className={`transition-transform duration-300 ${isOpen ? 'scale-110' : 'group-hover/select:scale-110'} ${dark ? 'text-primary-400' : 'text-primary-600'}`} size={24} />
                <div className="flex flex-col items-start w-full overflow-hidden">
                    <span className={`text-[10px] uppercase font-black tracking-widest ${dark ? 'text-primary-300/80' : 'text-slate-500'}`}>{label}</span>
                    <div className="flex items-center justify-between w-full">
                        <span className={`font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>
                            {selectedOption.label}
                        </span>
                        <ChevronDown className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''} ${dark ? 'text-white/60' : 'text-slate-400'}`} size={16} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute z-50 left-0 right-0 mt-2 p-2 rounded-[2rem] shadow-2xl border backdrop-blur-3xl ${dark
                            ? 'bg-slate-900/90 border-white/10'
                            : 'bg-white/95 border-slate-100'
                            }`}
                    >
                        <div className="max-h-60 overflow-y-auto no-scrollbar">
                            {options.map((option) => (
                                <motion.div
                                    key={option.value}
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-6 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm mb-1 last:mb-0 ${value === option.value
                                        ? dark ? 'bg-primary-600 text-white' : 'bg-primary-600 text-white'
                                        : dark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {option.label}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
