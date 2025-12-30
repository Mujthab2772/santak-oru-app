import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Plus, Trash2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';

const Wishlist = () => {
    const [wishes, setWishes] = useLocalStorage('santa-wishlist', []);
    const [newItem, setNewItem] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleShare = () => {
        Swal.fire({
            title: 'Wishlist Sent to North Pole! 📨',
            text: 'Santa has received your requests via Sleigh-Mail.',
            icon: 'success',
            confirmButtonText: 'Awesome!',
            confirmButtonColor: '#d42426', // Christmas red
            background: '#fff',
            backdrop: `
                rgba(0,0,123,0.4)
                url("https://media.giphy.com/media/26tP21xO4yqYc66nS/giphy.gif")
                left top
                no-repeat
            `
        });
    };

    const addWish = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            setWishes([...wishes, { id: Date.now(), item: newItem, priority, checked: false }]);
            setNewItem('');
        }
    };

    const toggleCheck = (id) => {
        setWishes(wishes.map(w => w.id === id ? { ...w, checked: !w.checked } : w));
    }

    const removeWish = (id) => {
        setWishes(wishes.filter(w => w.id !== id));
    }

    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-red-500';
        if (p === 'Medium') return 'text-yellow-500';
        return 'text-green-500';
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-christmas-primary font-bold mb-8 hover:underline">
                <ArrowLeft /> Back to HQ
            </Link>

            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-end mb-8 border-b pb-4">
                    <div>
                        <h1 className="t-heading text-5xl text-christmas-red">My Wishlist 🎁</h1>
                        <p className="text-gray-500">Dear Santa, I've been very good...</p>
                    </div>
                    <button onClick={handleShare} className="btn-secondary flex items-center gap-2">
                        <Share2 size={18} /> Share with Santa
                    </button>
                </div>

                <form onSubmit={addWish} className="glass-card p-4 flex gap-4 items-center mb-8 bg-gray-50">
                    <input
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        placeholder="I wish for..."
                        className="flex-1 p-3 bg-white rounded-lg border focus:ring-2 focus:ring-christmas-gold focus:outline-none"
                    />
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="p-3 bg-white rounded-lg border"
                    >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                    <button type="submit" className="p-3 bg-christmas-green text-white rounded-lg hover:bg-green-800 transition">
                        <Plus size={24} />
                    </button>
                </form>

                <div className="space-y-3">
                    {wishes.map(wish => (
                        <motion.div
                            layout
                            key={wish.id}
                            className={`p-4 rounded-xl border flex items-center justify-between group ${wish.checked ? 'bg-gray-100 opacity-60' : 'bg-white shadow-sm hover:shadow-md'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => toggleCheck(wish.id)}
                                    className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${wish.checked ? 'bg-christmas-green border-christmas-green' : 'border-gray-300'}`}
                                >
                                    {wish.checked && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`text-lg ${wish.checked ? 'line-through text-gray-400' : ''}`}>{wish.item}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-bold flex items-center gap-1 ${getPriorityColor(wish.priority)}`}>
                                    <Star size={14} fill="currentColor" /> {wish.priority}
                                </span>
                                <button onClick={() => removeWish(wish.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {wishes.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            Your list is empty! Santa won't know what to bring! 😱
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
