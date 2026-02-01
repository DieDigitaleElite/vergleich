
import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vogue-ai-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vogue-ai-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[90] flex justify-center animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-2xl border border-white/10 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="bg-amber-500/20 p-2 rounded-full hidden sm:block">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-widest">Cookie & Affiliate Info</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Wir nutzen Cookies, um Ihr Erlebnis zu verbessern und die Funktion unserer Affiliate-Links zu gewährleisten. Durch die Nutzung der App stimmen Sie der Verwendung zu.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 shrink-0">
          <button 
            onClick={() => setIsVisible(false)}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition"
          >
            Ablehnen
          </button>
          <button 
            onClick={handleAccept}
            className="bg-white text-black px-8 py-3 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-white transition duration-300"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
