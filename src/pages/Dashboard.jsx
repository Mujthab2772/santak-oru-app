import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { jsPDF } from "jspdf";
import confetti from "canvas-confetti";
import { Plus, Trash2, Gift, CheckCircle, Circle, Sparkles, Share2, Ticket, Heart, Book, Smile, User, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AISuggester from '../components/AISuggester';
import FestiveAlert from '../components/FestiveAlert';
import SocialShareModal from '../components/SocialShareModal';
import AddGiftModal from '../components/AddGiftModal';
import ConfirmationModal from '../components/ConfirmationModal';
import SantaTracker from '../components/SantaTracker';

const MOODS = [
    "Feeling generous! 🎁", "Checking my list twice... 📝", "Ho Ho Ho! 🎅", "Where are the cookies? 🍪", "Sleigh needs a tune-up 🛷"
];

const Dashboard = () => {
    const [recipients, setRecipients] = useLocalStorage('santas-recipients', []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [giftModalRecipient, setGiftModalRecipient] = useState(null);
    const [newRecipient, setNewRecipient] = useState({ name: '', relationship: 'Family', budget: '' });
    const [santaMood, setSantaMood] = useState(MOODS[0]);
    const [nicenessScore, setNicenessScore] = useState(85);

    // Confirmation State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, recipientId: null });

    useEffect(() => {
        setSantaMood(MOODS[Math.floor(Math.random() * MOODS.length)]);
        setNicenessScore(Math.floor(Math.random() * 20) + 80); // Random score 80-99
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(139, 0, 0);
        doc.text("SantaVerse - Gift Master Plan", 105, 20, { align: "center" });

        let y = 40;
        const totalBudget = calculateTotalBudget();
        const totalSpent = calculateTotalSpent();

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Budget: $${totalBudget}   |   Spent: $${totalSpent}`, 105, 30, { align: "center" });

        recipients.forEach(r => {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setFontSize(16);
            doc.setTextColor(139, 0, 0);
            doc.text(`${r.name} (${r.relationship})`, 20, y);
            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Budget: $${r.budget}`, 150, y);
            y += 8;
            doc.setTextColor(0);

            if (r.gifts.length === 0) {
                doc.text("- No gifts planned yet", 30, y);
                y += 8;
            }
            r.gifts.forEach(g => {
                const status = g.status.charAt(0).toUpperCase() + g.status.slice(1);
                doc.text(`- ${g.name} ($${g.price})  -  ${status}`, 30, y);
                y += 7;
            });
            y += 10;
            doc.setDrawColor(200);
            doc.line(20, y - 5, 190, y - 5);
        });
        doc.save("santa-gift-plan.pdf");
    };

    const addRecipient = (e) => {
        e.preventDefault();
        if (!newRecipient.name) return;
        setRecipients([...recipients, {
            ...newRecipient,
            id: Date.now(),
            gifts: [],
            budget: parseFloat(newRecipient.budget) || 0
        }]);
        setNewRecipient({ name: '', relationship: 'Family', budget: '' });
        setShowAddForm(false);
        setAlertMsg("Added to the Good List! 📜");
        setShowAlert(true);
    };

    const initiateRemoveRecipient = (id) => {
        setConfirmModal({ isOpen: true, recipientId: id });
    };

    const confirmRemove = () => {
        if (confirmModal.recipientId) {
            setRecipients(recipients.filter(r => r.id !== confirmModal.recipientId));
            setAlertMsg("Recipient removed from list.");
            setShowAlert(true);
        }
        setConfirmModal({ isOpen: false, recipientId: null });
    };

    const addGift = (recipientId, giftName, price) => {
        const updatedRecipients = recipients.map(r => {
            if (r.id === recipientId) {
                return {
                    ...r,
                    gifts: [...r.gifts, { id: Date.now(), name: giftName, price: parseFloat(price) || 0, status: 'planned' }]
                };
            }
            return r;
        });
        setRecipients(updatedRecipients);
    };

    const updateGiftStatus = (recipientId, giftId) => {
        const statuses = ['planned', 'purchased', 'wrapped', 'delivered'];
        const updatedRecipients = recipients.map(r => {
            if (r.id === recipientId) {
                const updatedGifts = r.gifts.map(g => {
                    if (g.id === giftId) {
                        const nextIndex = (statuses.indexOf(g.status) + 1) % statuses.length;
                        if (statuses[nextIndex] === 'delivered') {
                            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                            setAlertMsg("Ho Ho Ho! Gift Delivered! 🎁");
                            setShowAlert(true);
                        }
                        return { ...g, status: statuses[nextIndex] };
                    }
                    return g;
                });
                return { ...r, gifts: updatedGifts };
            }
            return r;
        });
        setRecipients(updatedRecipients);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planned': return 'gray';
            case 'purchased': return '#FFD700'; // gold
            case 'wrapped': return '#228B22'; // green
            case 'delivered': return '#8B0000'; // red
            default: return 'gray';
        }
    };

    const calculateTotalSpent = () => {
        return recipients.reduce((total, r) => {
            return total + r.gifts.reduce((sum, g) => g.status !== 'planned' ? sum + g.price : sum, 0);
        }, 0);
    };

    const calculateTotalBudget = () => recipients.reduce((sum, r) => sum + r.budget, 0);

    return (
        <div className="min-h-screen pb-20 p-2 md:p-8">

            {/* Header / Stats */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 max-w-7xl mx-auto">
                <div>
                    <Link to="/" className="text-2xl font-heading text-christmas-red hover:scale-105 transition-transform inline-block">🎅 SantaVerse</Link>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-800">Gift Dashboard</h1>
                    <p className="text-gray-500 italic mt-1">Status: <span className="text-christmas-green font-bold">{santaMood}</span></p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-center">
                    <SantaTracker />

                    <div className="bg-white p-4 rounded-xl shadow-md border-b-4 border-christmas-gold text-center min-w-[120px] h-[160px] flex flex-col justify-center">
                        <span className="block text-gray-400 text-xs uppercase font-bold">Niceness Score</span>
                        <span className={`block text-3xl font-heading ${nicenessScore > 90 ? 'text-green-600' : 'text-yellow-600'}`}>{nicenessScore}%</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-md border-b-4 border-christmas-green text-center min-w-[140px] h-[160px] flex flex-col justify-center">
                        <span className="block text-gray-400 text-xs uppercase font-bold">Budget Spent</span>
                        <span className="block text-2xl font-bold text-gray-700">${calculateTotalSpent()} <span className="text-sm text-gray-400 font-normal">/ ${calculateTotalBudget()}</span></span>
                    </div>
                </div>
            </header>

            {/* Quick Actions */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <Link to="/secret-santa" className="glass-card p-4 hover:scale-105 transition-transform flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-christmas-red group-hover:bg-christmas-red group-hover:text-white transition-colors">
                        <Ticket size={24} />
                    </div>
                    <span className="font-bold text-gray-700">Secret Santa</span>
                </Link>
                <Link to="/wishlist" className="glass-card p-4 hover:scale-105 transition-transform flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-christmas-gold group-hover:bg-christmas-gold group-hover:text-white transition-colors">
                        <Heart size={24} />
                    </div>
                    <span className="font-bold text-gray-700">My Wishlist</span>
                </Link>
                <Link to="/memories" className="glass-card p-4 hover:scale-105 transition-transform flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-christmas-green group-hover:bg-christmas-green group-hover:text-white transition-colors">
                        <Book size={24} />
                    </div>
                    <span className="font-bold text-gray-700">Memories</span>
                </Link>
                <Link to="/roast" className="glass-card p-4 hover:scale-105 transition-transform flex flex-col items-center justify-center text-center gap-2 group cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Smile size={24} />
                    </div>
                    <span className="font-bold text-gray-700">Santa Roast</span>
                </Link>
            </div>

            {/* Main Recipient Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-heading text-gray-800">Gift Recipients</h2>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-500 font-bold">{recipients.length} People</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add New Card */}
                    <motion.div
                        onClick={() => setShowAddForm(true)}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:border-christmas-red hover:bg-red-50 transition-colors group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:text-christmas-red group-hover:scale-110 transition-all mb-4">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 group-hover:text-christmas-red">Add Recipient</h3>
                    </motion.div>

                    {/* Recipient Cards */}
                    <AnimatePresence>
                        {recipients.map(recipient => (
                            <RecipientCard
                                key={recipient.id}
                                recipient={recipient}
                                onRemove={() => initiateRemoveRecipient(recipient.id)}
                                onAddGift={addGift}
                                onUpdateStatus={updateGiftStatus}
                                getStatusColor={getStatusColor}
                                openAddGiftModal={() => setGiftModalRecipient(recipient.id)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* AI Floating Button */}
            <motion.button
                onClick={() => setShowAI(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-christmas-gold to-yellow-400 text-red-900 p-4 rounded-full shadow-2xl border-4 border-white z-50 flex items-center gap-2 font-bold pr-6"
            >
                <Sparkles size={24} /> Ask Santa AI
            </motion.button>

            {/* Add Recipient Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            <h2 className="text-3xl font-heading text-christmas-red mb-6 text-center">Add to Nice List 📜</h2>
                            <form onSubmit={addRecipient} className="space-y-4">
                                <input
                                    placeholder="Name"
                                    value={newRecipient.name}
                                    onChange={e => setNewRecipient({ ...newRecipient, name: e.target.value })}
                                    className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:ring-2 focus:ring-christmas-red focus:outline-none"
                                    autoFocus
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={newRecipient.relationship}
                                        onChange={e => setNewRecipient({ ...newRecipient, relationship: e.target.value })}
                                        className="p-4 bg-gray-50 rounded-xl border-gray-200 outline-none"
                                    >
                                        <option>Family</option>
                                        <option>Friend</option>
                                        <option>Partner</option>
                                        <option>Colleague</option>
                                        <option>Child</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Budget ($)"
                                        value={newRecipient.budget}
                                        onChange={e => setNewRecipient({ ...newRecipient, budget: e.target.value })}
                                        className="p-4 bg-gray-50 rounded-xl border-gray-200 focus:ring-2 focus:ring-christmas-gold outline-none"
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full py-4 text-lg mt-4">Add Person</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sub-Components */}
            {showAI && (
                <AISuggester
                    onClose={() => setShowAI(false)}
                    recipients={recipients}
                    onSelectGift={(recipId, name, price) => {
                        addGift(Number(recipId), name, price);
                        setAlertMsg(`Added ${name} to list!`);
                        setShowAlert(true);
                    }}
                />
            )}
            {showAlert && (
                <FestiveAlert message={alertMsg} onClose={() => setShowAlert(false)} />
            )}
            {showShareModal && (
                <SocialShareModal
                    onClose={() => setShowShareModal(false)}
                    onShare={(platform) => {
                        downloadPDF();
                        setAlertMsg(`Shared via ${platform}`);
                        setShowAlert(true);
                        setShowShareModal(false);
                    }}
                />
            )}
            {giftModalRecipient && (
                <AddGiftModal
                    recipientId={giftModalRecipient}
                    onClose={() => setGiftModalRecipient(null)}
                    onAdd={(recipId, name, price) => {
                        addGift(Number(recipId), name, price);
                        setAlertMsg(`Added ${name} to list!`);
                        setShowAlert(true);
                    }}
                />
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                title="Remove from List?"
                message="Are you sure you want to remove this person? Their gift ideas will be lost forever (and Santa might frown)."
                confirmText="Yes, Remove"
                cancelText="Keep"
                onConfirm={confirmRemove}
                onCancel={() => setConfirmModal({ isOpen: false, recipientId: null })}
            />
        </div>
    );
};

// Recipient Card Component
const RecipientCard = ({ recipient, onRemove, onAddGift, onUpdateStatus, getStatusColor, openAddGiftModal }) => {
    const spent = recipient.gifts.reduce((sum, g) => g.status !== 'planned' ? sum + g.price : sum, 0);
    const progress = Math.min((spent / recipient.budget) * 100, 100);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
        >
            <div className="p-5 bg-gradient-to-br from-red-50 to-white border-b border-gray-100 flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{recipient.name}</h2>
                    <span className="text-xs font-bold text-christmas-red bg-red-100 px-2 py-1 rounded mt-1 inline-block uppercase tracking-wider">{recipient.relationship}</span>
                </div>
                <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1 font-medium text-gray-600">
                        <span>Budget: ${recipient.budget}</span>
                        <span className={spent > recipient.budget ? 'text-red-500' : 'text-green-600'}>Spent: ${spent}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${spent > recipient.budget ? 'bg-red-500' : 'bg-christmas-green'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-gray-200">
                    {recipient.gifts.length === 0 && <div className="text-center text-gray-400 italic py-4 text-sm">No gifts planned yet. <br /> Santa is waiting!</div>}
                    {recipient.gifts.map(gift => (
                        <div key={gift.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg group">
                            <button
                                onClick={() => onUpdateStatus(recipient.id, gift.id)}
                                className="transition-transform active:scale-95"
                                title={`Current Status: ${gift.status}`}
                            >
                                {gift.status === 'delivered' ? <CheckCircle size={20} className="text-christmas-red" /> :
                                    gift.status === 'wrapped' ? <Gift size={20} className="text-christmas-green" /> :
                                        gift.status === 'purchased' ? <CheckCircle size={20} className="text-yellow-500" /> :
                                            <Circle size={20} className="text-gray-300" />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-700 truncate">{gift.name}</p>
                                <p className="text-xs text-gray-400 flex justify-between">
                                    <span>${gift.price}</span>
                                    <span className="capitalize">{gift.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={openAddGiftModal}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-christmas-red hover:text-christmas-red hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Add Gift
                </button>
            </div>
        </motion.div>
    );
};

export default Dashboard;
