import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import { Gift, Sparkles, Snowflake } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-50"></div>

            {/* Ambient Red Glow (Emergency Light) */}
            <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent pointer-events-none"
            />

            {/* Scrolling Ticker Tape via CSS/Marquee */}
            <div className="absolute top-0 left-0 w-full bg-yellow-400 text-black font-bold py-1 overflow-hidden z-20 shadow-md">
                <div className="animate-marquee whitespace-nowrap flex gap-8">
                    <span>🚨 BREAKING: Rudolph demands GPS upgrade or refuses to fly.</span>
                    <span>❄️ WEATHER WARNING: Blizzard expected in Sector 7G.</span>
                    <span>🍪 COOKIE SHORTAGE: Mrs. Claus declares emergency batch.</span>
                    <span>📉 NICE LIST INTEGRITY: 89% (Trending Down).</span>
                    <span>⚠️ ELVES ON STRIKE: Demanding taller workbenches.</span>
                </div>
            </div>

            <div className="max-w-4xl w-full z-10 grid md:grid-cols-2 gap-12 items-center mt-12 md:mt-0">

                {/* Left Col: The Hook */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-left space-y-6"
                >
                    <div className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded-sm mb-2 animate-pulse">
                        System Status: CRITICAL
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mix-blend-screen">
                        SANTA NEEDS <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">BACKUP.</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl font-light border-l-4 border-red-800 pl-4 py-1">
                        Systems failing. Sleigh OS crashed. The Elves are playing Fortnite. <br />
                        We are outsourcing Christmas Management to <strong>YOU</strong>.
                    </p>

                    <div className="flex flex-col gap-4 pt-4">
                        <Link to="/dashboard" className="group relative w-fit">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <button className="relative px-8 py-5 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                                <span className="flex items-center space-x-5">
                                    <span className="pr-6 text-gray-100 font-bold text-xl uppercase tracking-wider group-hover:text-yellow-400 transition-colors">
                                        Initialize HQ
                                    </span>
                                </span>
                                <span className="pl-6 text-red-500 group-hover:text-gray-100 transition duration-200">
                                    &rarr;
                                </span>
                            </button>
                        </Link>
                        <p className="text-xs text-gray-500 font-sans opacity-60">
                            *By clicking, you agree to mandatory eggnog consumption.
                        </p>
                    </div>
                </motion.div>

                {/* Right Col: The Visual (Interactive Terminal) */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative hidden md:block"
                >
                    <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 font-mono text-sm shadow-2xl relative">
                        {/* Terminal Header */}
                        <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-auto text-gray-600 text-xs">root@northpole-mainframe:~</span>
                        </div>

                        {/* Terminal Content */}
                        <div className="space-y-2 text-green-400 h-64 overflow-hidden">
                            <TypewriterEffect />
                        </div>

                        {/* Sticker */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 5, repeatDelay: 1 }}
                            className="absolute -bottom-8 -right-8"
                        >
                            <span className="text-6xl filter drop-shadow-lg">🎅</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>


        </div>
    );
};

const TypewriterEffect = () => {
    const lines = [
        "> CONNECTING TO REINDEER_NET...",
        "> [SUCCESS] 9/9 Reindeer Online.",
        "> [WARNING] Blitzen Heart Rate: ELEVATED",
        "> LOADING GIFT_DATABASE.JSON...",
        "> [ERROR] corruption in 'Coal' sector.",
        "> BYPASSING SECURITY PROTOCOLS...",
        "> USER AUTHENTICATED: ADMIN_SANTA_ALIAS",
        "> AWAITING COMMAND...",
        "> _"
    ];

    return (
        <div className="flex flex-col">
            {lines.map((line, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5, duration: 0.2 }}
                    className={line.includes("ERROR") || line.includes("WARNING") ? "text-red-400" : "text-green-400"}
                >
                    {line}
                </motion.span>
            ))}
        </div>
    );
};

export default Landing;
