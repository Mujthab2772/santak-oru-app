import React, { useEffect } from 'react';
import { X, Snowflake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FestiveAlert = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="fixed top-4 left-1/2 bg-christmas-red text-white py-3 px-6 rounded-full shadow-2xl flex items-center gap-3 z-50 border border-red-400"
            >
                <Snowflake size={20} className="animate-spin-slow" />
                <span className="font-bold">{message}</span>
                <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X size={18} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default FestiveAlert;
