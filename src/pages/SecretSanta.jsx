import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Shuffle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import FestiveAlert from '../components/FestiveAlert';

const SecretSanta = () => {
    const [participants, setParticipants] = useState([]);
    const [name, setName] = useState('');
    const [matches, setMatches] = useState([]);
    const [revealed, setRevealed] = useState(null);
    const [alertMsg, setAlertMsg] = useState('');

    const addParticipant = (e) => {
        e.preventDefault();
        if (name.trim()) {
            setParticipants([...participants, name.trim()]);
            setName('');
        }
    };

    const generateMatches = () => {
        if (participants.length < 2) {
            setAlertMsg("Need at least 2 santas to tangle the lights! 🎄");
            return;
        }

        let shuffled = [...participants];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Validate no one has themselves
        let valid = true;
        for (let i = 0; i < participants.length; i++) {
            if (participants[i] === shuffled[i]) valid = false;
        }

        if (!valid) {
            // Simple retry logic for demo
            generateMatches();
            return;
        }

        const pairs = participants.map((p, i) => ({
            santa: p,
            recipient: shuffled[i]
        }));

        setMatches(pairs);
        confetti({ spread: 180, particleCount: 200 });
    };

    return (
        <div className="min-h-screen bg-christmas-green/10 p-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-christmas-primary font-bold mb-8 hover:underline">
                <ArrowLeft /> Back to HQ
            </Link>

            <div className="max-w-2xl mx-auto">
                <h1 className="t-heading text-5xl mb-6 text-center">Secret Santa Generator 🤫</h1>

                <div className="glass-card p-8 mb-8">
                    <form onSubmit={addParticipant} className="flex gap-4 mb-8">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter participant name..."
                            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-christmas-red"
                        />
                        <button type="submit" className="btn-secondary">
                            <UserPlus size={20} /> Add
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {participants.map((p, i) => (
                            <span key={i} className="bg-white px-4 py-2 rounded-full shadow-sm text-christmas-secondary font-medium">
                                🎅 {p}
                            </span>
                        ))}
                    </div>

                    {participants.length > 1 && (
                        <button onClick={generateMatches} className="btn-primary w-full flex justify-center items-center gap-2">
                            <Shuffle size={20} /> Assign Secret Santas
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {matches.map((match, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 flex justify-between items-center"
                        >
                            <span className="font-heading text-2xl text-christmas-red">🎅 {match.santa}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400">has...</span>
                                {revealed === i ? (
                                    <span className="font-bold text-xl text-christmas-green animate-pulse">{match.recipient}</span>
                                ) : (
                                    <span className="bg-gray-200 text-gray-400 px-3 py-1 rounded">?????</span>
                                )}
                                <button onClick={() => setRevealed(revealed === i ? null : i)} className="text-gray-500 hover:text-christmas-red">
                                    {revealed === i ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {alertMsg && <FestiveAlert message={alertMsg} onClose={() => setAlertMsg('')} />}
        </div>
    );
};

export default SecretSanta;
