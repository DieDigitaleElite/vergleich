
import React from 'react';

interface FooterProps {
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-white border-t py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-left">
            <h2 className="text-xl font-serif tracking-tighter mb-2">VOGUE AI</h2>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Next-Gen Fashion AI Lab
            </p>
          </div>
          
          <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <button onClick={() => onOpenLegal('impressum')} className="hover:text-black transition">Impressum</button>
            <button onClick={() => onOpenLegal('datenschutz')} className="hover:text-black transition">Datenschutz</button>
            <a href="#" className="hover:text-black transition">Kontakt</a>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-[9px] text-zinc-300 max-w-xs leading-relaxed uppercase tracking-tighter">
              Diese Anwendung nutzt künstliche Intelligenz zur Stilberatung. Alle Daten werden DSGVO-konform verarbeitet.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
