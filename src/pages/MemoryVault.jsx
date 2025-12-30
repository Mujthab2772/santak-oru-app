import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemoryVault = () => {
    const [memories, setMemories] = useLocalStorage('santa-memories', []);
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');

    const addMemory = (e) => {
        e.preventDefault();
        if (title && note) {
            setMemories([{
                id: Date.now(),
                title,
                note,
                date: new Date().toLocaleDateString()
            }, ...memories]);
            setTitle('');
            setNote('');
        }
    };

    return (
        <div className="min-h-screen bg-red-50 p-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-christmas-primary font-bold mb-8 hover:underline">
                <ArrowLeft /> Back to HQ
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="t-heading text-5xl mb-2 text-christmas-red">The Memory Vault 🎄</h1>
                    <p className="text-gray-600">Save your favorite Christmas moments, recipes, and wishes.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Input Card */}
                    <div className="glass-card p-6 md:col-span-1 h-fit">
                        <h3 className="text-xl font-bold mb-4 text-christmas-green flex items-center gap-2"><Sparkles size={20} /> New Memory</h3>
                        <form onSubmit={addMemory} className="flex flex-col gap-4">
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Title (e.g., Grandma's Cookies)"
                                className="p-3 rounded-lg border border-gray-200"
                            />
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                placeholder="Write your memory here..."
                                className="p-3 rounded-lg border border-gray-200 h-32 resize-none"
                            />
                            <button type="submit" className="btn-primary flex justify-center items-center gap-2">
                                <Save size={18} /> Save to Vault
                            </button>
                        </form>
                    </div>

                    {/* Memories Grid */}
                    <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                        {memories.map((m, i) => (
                            <motion.div
                                key={m.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-md border-t-4 border-christmas-gold relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles size={40} className="text-christmas-gold" />
                                </div>
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{m.date}</span>
                                <h4 className="font-heading text-2xl text-christmas-red mb-2">{m.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{m.note}</p>
                            </motion.div>
                        ))}
                        {memories.length === 0 && (
                            <div className="col-span-2 text-center p-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No memories stored yet. Start capturing the magic!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryVault;
