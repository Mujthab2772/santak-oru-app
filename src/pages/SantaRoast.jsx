import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Pause, Sparkles, ArrowLeft } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Link } from 'react-router-dom';
import confetti from "canvas-confetti";

const ROAST_LEVELS = [
    { id: 'mild', label: 'Thoda Mitha 🌶️', prompt: 'playful, teasing, suitable for family' },
    { id: 'spicy', label: 'Teekha 🌶️🌶️', prompt: 'sarcastic, witty, slightly roasting habits' },
    { id: 'savage', label: 'Kadak 💀', prompt: 'ruthless, funny emotional damage, absolutely destroying them (but still festive)' }
];

// Hinglish/Desi Fallbacks for sweet demos
const MOCK_ROASTS = {
    mild: [
        "Oye {name}! I checked the list. You are Naughty... but cute naughty, like a puppy eating chappal. Here is a chocolate.",
        "Arre {name}, simple wish list this year? Just 'Peace of Mind'? Beta, even Amazon doesn't deliver that.",
        "Sat Sri Akal {name}! You ate all the Gulab Jamun I left? It's okay, you are looking healthy!"
    ],
    spicy: [
        "Oye {name}! Your internet history is darker than my sunglasses. Delete it before mummy sees!",
        "Listen {name}, you want a gym membership? Good choice. Santa also struggle with the belly, we are twins!",
        "Arre {name}, asking for iPhone 15? First pass 10th standard with good marks, then talk business!"
    ],
    savage: [
        "Oye {name}! You are single since birth or what? Even the reindeer swipe left on you. Marry a tree!",
        "Listen {name}, I skipped your house last year not because of fog, but because your chai was horrible. Do better!",
        "Oye {name}, stop asking for 'One True Love'. Santa is a magical fat man, not a miracle worker for hopeless cases!"
    ]
};

const SantaRoast = () => {
    const [name, setName] = useState('');
    const [roastLevel, setRoastLevel] = useState(ROAST_LEVELS[0]);
    const [loading, setLoading] = useState(false);
    const [roastText, setRoastText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    // Audio / Speech
    const synth = window.speechSynthesis;
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const allVoices = synth.getVoices();
            setVoices(allVoices);
        };
        loadVoices();
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
    }, []);

    const generateRoast = async () => {
        if (!name.trim()) {
            setAlertMessage("Arre enter your name first, Beta! 🎅");
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }
        setLoading(true);
        setRoastText('');
        setIsPlaying(false);
        synth.cancel();

        const effectiveKey = import.meta.env.VITE_GOOGLE_API_KEY || localStorage.getItem('gemini_api_key');

        try {
            if (effectiveKey) {
                // REAL AI MODE (Santa Paaji)
                const genAI = new GoogleGenerativeAI(effectiveKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are "Santa Paaji" (Santa Pappji), a hilarious, cool, Punjabi-style Santa Claus who loves butter chicken and roasting people.
                    User Name: ${name}
                    Roast Level: ${roastLevel.label} (${roastLevel.prompt})

                    Style Guide:
                    - Use Indian-English slang like "Oye", "Beta" (child), "Guru", "Yaar", "Changa".
                    - Be savage but extremely funny and warm.
                    - Example: "Oye ${name}, you want iPhone? First stop eating my cookies yaar!"
                    
                    Generate a short, punchy 2-3 sentence roast script.
                    Output ONLY the text to be spoken. No quotes.
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                setRoastText(response.text());
            } else {
                // MOCK / DEMO MODE (Seamless fallback with Paaji flavor)
                await new Promise(r => setTimeout(r, 1500));
                const templates = MOCK_ROASTS[roastLevel.id];
                const template = templates[Math.floor(Math.random() * templates.length)];
                setRoastText(template.replace(/{name}/g, name));
            }
            confetti({ particleCount: 50, spread: 50, colors: ['#000000', '#FF0000'] });
        } catch (error) {
            console.error("Roast error:", error);
            const templates = MOCK_ROASTS[roastLevel.id];
            const template = templates[Math.floor(Math.random() * templates.length)];
            setRoastText(template.replace(/{name}/g, name));
        } finally {
            setLoading(false);
        }
    };

    const speakRoast = () => {
        if (!roastText) return;

        if (synth.speaking) {
            synth.cancel();
            setIsPlaying(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(roastText);

        // Indian Accent Finder
        const pajiVoice = voices.find(v => v.lang.includes('en-IN')) ||
            voices.find(v => v.name.includes('India')) ||
            voices.find(v => v.name.includes('Male')) ||
            voices[0];

        if (pajiVoice) utterance.voice = pajiVoice;
        utterance.pitch = 0.8;
        utterance.rate = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);

        synth.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>

            <div className="max-w-2xl w-full relative z-10">
                <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2" /> Back to Safety
                </Link>

                <AnimatePresence>
                    {alertMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 flex items-center gap-2 border-2 border-white"
                        >
                            <Sparkles size={20} className="text-yellow-300" />
                            {alertMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-neutral-800/80 backdrop-blur-xl border border-neutral-700 p-8 rounded-3xl shadow-2xl relative"
                >
                    {/* Glowing Ring */}
                    <div className={`absolute -top-10 -left-10 w-20 h-20 bg-red-600 rounded-full blur-3xl opacity-50 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                    <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-green-900 rounded-full blur-3xl opacity-50"></div>

                    <div className="text-center mb-8">
                        <motion.div
                            animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] border-4 border-neutral-600"
                        >
                            <Mic size={40} className="text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-heading text-red-500 mb-2">Santa Paaji's Roast Adda 🎙️</h1>
                        <p className="text-gray-400">Step up Beta... if you dare.</p>
                    </div>

                    <div className="space-y-6">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your name..."
                            className="w-full bg-neutral-900 border border-neutral-700 p-4 rounded-xl text-xl text-center focus:ring-2 focus:ring-red-500 outline-none placeholder-gray-600"
                        />

                        <div className="grid grid-cols-3 gap-3">
                            {ROAST_LEVELS.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setRoastLevel(level)}
                                    className={`p-3 rounded-lg border transition-all ${roastLevel.id === level.id ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-neutral-900 border-neutral-700 text-gray-500 hover:border-gray-500'}`}
                                >
                                    <div className="font-bold text-sm md:text-base">{level.label}</div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={generateRoast}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-heading font-bold text-xl py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            {loading ? <Sparkles className="animate-spin" /> : <Mic />}
                            {loading ? "Cooking up a roast..." : "Roast Me, Paaji!"}
                        </button>

                        {/* Result Area with Formatting */}
                        <AnimatePresence>
                            {roastText && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-black/50 p-6 rounded-xl border border-neutral-700 mt-6"
                                >
                                    <p className="text-gray-300 italic text-lg leading-relaxed text-center mb-6 font-serif">
                                        "{roastText}"
                                    </p>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={speakRoast}
                                            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
                                        >
                                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                            {isPlaying ? "Stop" : "Sunno (Listen)"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SantaRoast;
