import React, { useState, useEffect } from 'react';

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const year = new Date().getFullYear();
        const christmas = new Date(year, 11, 25);
        if (new Date() > christmas) {
            christmas.setFullYear(year + 1);
        }

        const difference = +christmas - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds }
    ];

    return (
        <div className="flex gap-4 md:gap-6 justify-center mt-8">
            {timeUnits.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <div className="bg-white/80 backdrop-blur text-christmas-red font-heading text-3xl md:text-5xl font-bold w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl shadow-lg border border-red-100">
                        {unit.value || '0'}
                    </div>
                    <span className="text-gray-600 font-bold uppercase text-xs md:text-sm mt-2 tracking-wider">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Countdown;
