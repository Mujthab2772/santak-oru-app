import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddGiftModal = ({ recipientId, onClose, onAdd }) => {
    const [giftName, setGiftName] = useState('');
    const [giftPrice, setGiftPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (giftName) {
            onAdd(recipientId, giftName, giftPrice);
            setGiftName('');
            setGiftPrice('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                    <h3 className="font-heading text-2xl text-christmas-red mb-6">Add Gift Idea</h3>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            placeholder="Gift name (e.g., Lego set)"
                            value={giftName}
                            onChange={e => setGiftName(e.target.value)}
                            className="p-4 bg-gray-50 rounded-xl border-gray-200 focus:ring-2 focus:ring-christmas-red outline-none"
                            autoFocus
                        />
                        <input
                            type="number"
                            placeholder="Price ($)"
                            value={giftPrice}
                            onChange={e => setGiftPrice(e.target.value)}
                            className="p-4 bg-gray-50 rounded-xl border-gray-200 focus:ring-2 focus:ring-christmas-gold outline-none"
                        />
                        <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2">
                            <Plus size={18} /> Add Gift
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddGiftModal;
