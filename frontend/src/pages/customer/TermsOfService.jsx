import React, { useEffect } from 'react';
import SEO from '../../components/SEO';

const TermsOfService = () => {
    // Scroll to Top Logic
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full pb-20 pt-12 animate-fade-in relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <SEO 
                title="Terms of Service | HamroCinema" 
                description="Read the Terms of Service for HamroCinema. Learn about our ticketing policies, refunds, and user conduct."
            />
            
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-tight mb-4">
                    Terms of Service
                </h1>
                <p className="text-gray-400 text-sm tracking-wider uppercase">Last Updated: September 2026</p>
            </div>

            <div className="bg-[#1a1225]/60 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-10 text-gray-300 leading-relaxed font-medium">
                
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">1. Ticket Purchasing</h2>
                    <p>
                        All ticket purchases made through HamroCinema are strictly for personal use. By purchasing a ticket, you agree to arrive at the designated cinema venue on time. Latecomers may be denied entry to ensure a disruption-free experience for other patrons.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">2. Refund & Cancellation Policy</h2>
                    <p>
                        Tickets purchased through HamroCinema are generally non-refundable and non-transferable. However, in the rare event of a technical failure on our end or a cancelled screening by the cinema, a full refund will be initiated to your original payment method. We do not offer refunds for accidental bookings or change of mind.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">3. User Conduct</h2>
                    <p>
                        You agree to use our platform responsibly. Any attempts to manipulate the ticketing system, scrape data, or engage in fraudulent activities will result in immediate account termination. Inside the cinema, users are expected to adhere to standard theater etiquette.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">4. eSewa Payment Terms</h2>
                    <p>
                        All online payments are securely processed via eSewa. By choosing to pay with eSewa, you are also bound by eSewa's Terms and Conditions. HamroCinema holds no liability for transaction failures, network timeouts, or banking errors originating from the payment gateway.
                    </p>
                </section>

                <section className="space-y-4 pt-8 border-t border-purple-900/40">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Contact Us</h2>
                    <p>
                        For any legal inquiries or questions regarding these Terms of Service, please reach out to our legal department at <a href="mailto:legal@hamrocinema.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">legal@hamrocinema.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
