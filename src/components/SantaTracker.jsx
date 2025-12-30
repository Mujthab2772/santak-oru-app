import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Navigation, Wifi } from 'lucide-react';

const SantaTracker = () => {
    // Mock Location Data
    const LOCATIONS = [
        { city: "North Pole", lat: 90, long: 0, status: "Taking Off" },
        { city: "Auckland, New Zealand", lat: -36, long: 174, status: "Delivering Gifts" },
        { city: "Sydney, Australia", lat: -33, long: 151, status: "Eating Cookies" },
        { city: "Tokyo, Japan", lat: 35, long: 139, status: "Petting Reindeer" },
        { city: "Mumbai, India", lat: 19, long: 72, status: "Stuck in Traffic" },
        { city: "Paris, France", lat: 48, long: 2, status: "Admiring Lights" },
        { city: "New York, USA", lat: 40, long: -74, status: "Checking List" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % LOCATIONS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentLocation = LOCATIONS[currentIndex];

    return (
        <div className="bg-black/80 text-green-400 p-4 rounded-xl border border-green-900 font-mono shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
                <div className="flex items-center gap-2">
                    <Map size={18} className="animate-pulse" />
                    <h3 className="uppercase tracking-widest text-xs font-bold">Sleigh_Radar_v2.0</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <Wifi size={14} className="text-green-500" />
                    <span>ONLINE</span>
                </div>
            </div>

            <div className="relative h-40 bg-green-900/20 rounded-lg overflow-hidden border border-green-800/50 mb-4 grid place-items-center">
                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite] origin-bottom-right bg-gradient-to-t from-transparent via-green-500/10 to-transparent w-[100%] h-[100%] border-r border-green-500/30"></div>

                {/* World Map Background (Abstract) */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>

                <div className="z-10 text-center">
                    <motion.div
                        key={currentLocation.city}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-4xl mb-2"
                    >
                        🛷
                    </motion.div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">TARGET:</span>
                    <span className="font-bold text-white">{currentLocation.city}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">STATUS:</span>
                    <span className="text-yellow-400 animate-pulse">{currentLocation.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500">SPEED:</span>
                    <span>3,000,000 km/h</span>
                </div>
            </div>
        </div>
    );
};

export default SantaTracker;
