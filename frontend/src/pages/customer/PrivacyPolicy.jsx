import React, { useEffect } from 'react';
import SEO from '../../components/SEO'; 

const PrivacyPolicy = () => { 
  // Scroll to Top Logic 
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []); 
  
  return ( 
    <div className="w-full pb-20 pt-12 animate-fade-in relative z-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"> 
      <SEO title="Privacy Policy | HamroCinema" description="Learn how HamroCinema collects, uses, and protects your personal data and booking information." /> 
      <div className="text-center mb-12"> 
        <h1 className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight mb-4"> Privacy Policy </h1> 
        <p className="text-neutral-400 text-sm tracking-wider uppercase">Last Updated: September 2026</p> 
      </div> 
      <div className="bg-[#1A1A1A] border border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-10 text-neutral-300 leading-relaxed font-medium"> 
        <section className="space-y-4"> 
          <h2 className="text-2xl font-bold text-zinc-100">1. Data Collection</h2> 
          <p> Welcome to HamroCinema. We collect information to provide better services to all our users. The personal information we collect includes your username, email address, and booking history when you create an account, purchase movie tickets, or interact with our platform. </p> 
        </section> 
        <section className="space-y-4"> 
          <h2 className="text-2xl font-bold text-zinc-100">2. Data Usage</h2> 
          <p> We use the information we collect to operate, maintain, and provide the features and functionality of the Service. This includes managing your digital tickets, calculating your Loyalty Points, and notifying you about upcoming showtimes, schedule changes, or account security alerts. </p> 
        </section> 
        <section className="space-y-4"> 
          <h2 className="text-2xl font-bold text-zinc-100">3. Third-Party Payment via eSewa</h2> 
          <p> We prioritize your financial security above all else. HamroCinema <strong>does not</strong> store or process your credit card or direct bank account details on our servers. All digital transactions are securely routed through our authorized third-party payment partner, <strong>eSewa</strong>. When you proceed to checkout, you are subject to eSewa's privacy policies and military-grade security protocols. </p> 
        </section> 
        <section className="space-y-4"> 
          <h2 className="text-2xl font-bold text-zinc-100">4. Security</h2> 
          <p> We implement strict, industry-standard security measures (including JWT tokens, hashed passwords, and HTTPS encryption) to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, transaction information, and data stored on our Site. </p> 
        </section> 
        <section className="space-y-4 pt-8 border-t border-neutral-800"> 
          <h2 className="text-xl font-bold text-neutral-100 uppercase tracking-wider">Contact Us</h2> 
          <p> If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact our security team at <a href="mailto:security@hamrocinema.com" className="text-neutral-400 hover:text-neutral-100 transition-colors duration-200 ease-in-out">security@hamrocinema.com</a>. </p> 
        </section> 
      </div> 
    </div> 
  ); 
}; 

export default PrivacyPolicy;
