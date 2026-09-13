import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const PreferencesWidget = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const consent = localStorage.getItem('sitePreferencesConsent');
            if (!consent) {
                setIsVisible(true);
            }
        } catch (e) {
            console.warn("Storage access restricted by browser.");
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem('sitePreferencesConsent', 'true');
        } catch (e) {}
        setIsVisible(false);
    };

    const handleDecline = () => {
        try {
            localStorage.setItem('sitePreferencesConsent', 'false');
        } catch (e) {}
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0, transition: { duration: 0.3 } }}
                    transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                    className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:w-[400px] z-50 p-6 bg-[#1a1225]/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(147,51,234,0.25)]"
                >
                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                🛡️ Site Preferences
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                HamroCinema uses basic diagnostic data to enhance your browsing experience and serve personalized content. Read more in our <Link to="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4">Privacy Policy</Link>.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                onClick={handleAccept}
                                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all hover:scale-[1.02]"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={handleDecline}
                                className="flex-1 py-2.5 px-4 bg-transparent border border-purple-900/50 hover:border-purple-500/50 text-gray-400 hover:text-gray-200 text-sm font-medium rounded-xl transition-all"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PreferencesWidget;
