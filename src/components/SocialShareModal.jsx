import React from 'react';
import { Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialShareModal = ({ onClose, onShare }) => {
    const platforms = [
        { name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-500' },
        { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
        { name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
        { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    ];

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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl"
                >
                    <h3 className="font-heading text-2xl text-christmas-red mb-6">Share Your Gift List</h3>
                    <div className="flex justify-center gap-4">
                        {platforms.map(p => {
                            const Icon = p.icon;
                            return (
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    key={p.name}
                                    onClick={() => onShare(p.name)}
                                    className={`${p.color} text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                                >
                                    <Icon size={24} />
                                </motion.button>
                            );
                        })}
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-8 text-gray-400 hover:text-gray-600 font-bold text-sm"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SocialShareModal;
