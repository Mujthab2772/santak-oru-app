import React, { useState, useEffect } from 'react';
import { Sparkles, X, Plus, Loader2, Bot, Settings, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_SUGGESTIONS = [
    {
        roast: "Oh, you're shopping for a 'tech enthusiast'? I assume that means someone who resets the router for fun.",
        recommendations: [
            { name: "Noise Cancelling Headphones", price: 150, description: "To block out the haters.", isTroll: false },
            { name: "Mechanical Keyboard", price: 80, description: "Click clack goodness.", isTroll: false },
            { name: "Raspberry Pi Kit", price: 45, description: "For their unfinished projects.", isTroll: false },
            { name: "A single USB-C cable", price: 10, description: "They probably lost theirs.", isTroll: true }
        ]
    },
    {
        roast: "A 'chef' implies they don't just microwave noodles. Let's pretend that's true.",
        recommendations: [
            { name: "Cast Iron Skillet", price: 40, description: "Heavy metal cooking.", isTroll: false },
            { name: "Gourmet Spice Set", price: 30, description: "Flavor town population: them.", isTroll: false },
            { name: "Chef's Knife", price: 60, description: "Sharp and dangerous.", isTroll: false },
            { name: "Instant Ramen Value Pack", price: 5, description: "Let's be realistic.", isTroll: true }
        ]
    }
];

const AISuggester = ({ onClose, onSelectGift, recipients }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ age: '', interest: '', budget: '' });
    const [suggestions, setSuggestions] = useState([]);
    const [roast, setRoast] = useState('');
    const [selectedRecipientId, setSelectedRecipientId] = useState(recipients && recipients.length > 0 ? recipients[0].id : '');
    const [error, setError] = useState('');

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

    const saveApiKey = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        setShowSettings(false);
    };

    const handleSuggest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuggestions([]);
        setRoast('');
        setError('');

        const effectiveKey = import.meta.env.VITE_GOOGLE_API_KEY || localStorage.getItem('gemini_api_key');

        try {
            if (effectiveKey) {
                // REAL AI MODE
                const genAI = new GoogleGenerativeAI(effectiveKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are a witty, slightly sassy Santa Claus who has seen it all.
                    I need gift suggestions for a specific person.
                    Profile - Age: ${formData.age}, Interests: ${formData.interest}, Budget: $${formData.budget}

                    Task:
                    1. ROAST the person or their interests briefly in a funny, playful way (max 1 sentence). Use emojis.
                    2. Suggest 3 GENUINE, creative gift ideas that fit the budget.
                    3. Suggest 1 "TROLL" gift (useless, funny, or prank gift) related to their interests.

                    Output STRICTLY in this JSON format (no markdown code blocks, just raw JSON):
                    {
                        "roast": "Your spicy roast comment here",
                        "recommendations": [
                            { "name": "Item Name", "price": 25, "description": "Short reasoning", "isTroll": false },
                            { "name": "Item Name", "price": 25, "description": "Short reasoning", "isTroll": false },
                            { "name": "Item Name", "price": 25, "description": "Short reasoning", "isTroll": false },
                            { "name": "Troll Item Name", "price": 5, "description": "Why this is funny", "isTroll": true }
                        ]
                    }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().replace(/```json|```/g, '').trim();
                const data = JSON.parse(text);

                setRoast(data.roast);
                setSuggestions(data.recommendations);
            } else {
                // MOCK / DEMO MODE (Seamless fallback)
                await new Promise(r => setTimeout(r, 1500));
                // simple hash of interest to pick a mock
                const idx = (formData.interest.length) % MOCK_SUGGESTIONS.length;
                const mock = MOCK_SUGGESTIONS[idx];

                setRoast(mock.roast);
                setSuggestions(mock.recommendations);
            }
        } catch (err) {
            console.error(err);
            setError("Santa's connection is flaky. Check your API Key in settings!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border-2 border-christmas-gold flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-christmas-gold to-yellow-400 p-4 flex justify-between items-center text-red-900 shrink-0">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Bot size={28} />
                        <h2>Ask Santa AI</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            title="API Settings"
                        >
                            <Settings size={20} />
                        </button>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full"><X size={20} /></button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {showSettings ? (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800">
                                    <h3 className="font-bold flex items-center gap-2 mb-2"><Key size={16} /> API Configuration</h3>
                                    <p>Enter your Google Gemini API Key to enable real-time intelligence. (Optional - Demo mode works without it!)</p>
                                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs mt-2 block">Get Free Key →</a>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">API Key</label>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={e => setApiKey(e.target.value)}
                                        placeholder="Paste AIzaS..."
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-christmas-gold outline-none"
                                    />
                                </div>
                                <button onClick={saveApiKey} className="btn-primary w-full justify-center">Save Settings</button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <form onSubmit={handleSuggest} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Interests & Hobbies</label>
                                        <input
                                            value={formData.interest}
                                            onChange={e => setFormData({ ...formData, interest: e.target.value })}
                                            placeholder="e.g., Tech, Cooking, Star Wars..."
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-christmas-gold outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                                            <input
                                                type="number"
                                                value={formData.age}
                                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                                placeholder="25"
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Budget ($)</label>
                                            <input
                                                type="number"
                                                value={formData.budget}
                                                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                                placeholder="50"
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 bg-christmas-red text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-red-800 transition-all flex justify-center items-center gap-2"
                                    >
                                        {loading ? <><Loader2 className="animate-spin" /> Consulting the Workshop...</> : <><Sparkles /> Ask Sassy Santa</>}
                                    </button>
                                </form>

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-200">
                                        {error}
                                    </div>
                                )}

                                {suggestions.length > 0 && (
                                    <div className="mt-6 space-y-4">
                                        {roast && (
                                            <div className="p-4 bg-gray-100 rounded-xl border-l-4 border-christmas-red italic text-gray-700">
                                                "🎅 {roast}"
                                            </div>
                                        )}

                                        <h3 className="font-heading text-2xl text-christmas-green">Santa Recommends:</h3>
                                        {suggestions.map((item, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx}
                                                className={`p-4 rounded-xl border flex justify-between items-center ${item.isTroll ? 'bg-red-50 border-red-200' : 'bg-white border-yellow-200 shadow-sm'}`}
                                            >
                                                <div className="flex-1 pr-2">
                                                    <div className="font-bold text-lg flex items-center gap-2">
                                                        {item.name}
                                                        {item.isTroll && <span className="text-xs bg-red-200 px-2 py-0.5 rounded text-red-700 font-bold uppercase">Troll Gift</span>}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                    <div className="text-christmas-green font-bold mt-1">${item.price}</div>
                                                </div>
                                                {recipients && recipients.length > 0 && (
                                                    <button
                                                        onClick={() => onSelectGift(selectedRecipientId, item.name, item.price)}
                                                        className="p-2 bg-christmas-green text-white rounded-lg hover:bg-green-700 transition shadow-md"
                                                        title="Add to List"
                                                    >
                                                        <Plus size={20} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}

                                        {recipients && recipients.length > 0 && (
                                            <div className="mt-4 pt-4 border-t flex items-center justify-end gap-2 bg-gray-50 p-2 rounded-lg">
                                                <span className="text-sm font-bold text-gray-600">Add gifts to:</span>
                                                <select
                                                    value={selectedRecipientId}
                                                    onChange={e => setSelectedRecipientId(e.target.value)}
                                                    className="p-2 bg-white border rounded-lg outline-none text-sm font-medium"
                                                >
                                                    {recipients.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AISuggester;
