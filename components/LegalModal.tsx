
import React from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'impressum' | 'datenschutz' | null;
  onClose: () => void;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8 md:p-12 text-zinc-800">
          {type === 'impressum' ? (
            <div className="space-y-8">
              <h2 className="text-3xl font-serif italic mb-8 border-b pb-4">Impressum</h2>
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Angaben gemäß § 5 TMG</h3>
                <p className="text-base">
                  Max Mustermann<br />
                  VOGUE AI Fashion Lab<br />
                  Musterstraße 123<br />
                  10115 Berlin
                </p>
              </section>
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Kontakt</h3>
                <p className="text-base">
                  Telefon: +49 (0) 123 456789<br />
                  E-Mail: style@vogue-ai.de
                </p>
              </section>
              <section className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
                <p className="text-base">
                  Max Mustermann<br />
                  Musterstraße 123<br />
                  10115 Berlin
                </p>
              </section>
              <p className="text-[10px] text-zinc-400 pt-8 border-t">
                Haftungsausschluss: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-3xl font-serif italic mb-8 border-b pb-4">Datenschutzerklärung</h2>
              <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">1. Datenschutz auf einen Blick</h3>
                <p className="text-base leading-relaxed">
                  Wir freuen uns über Ihr Interesse an unserer App. Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Wir verarbeiten Ihre hochgeladenen Bilder ausschließlich zum Zwecke der Stilberatung und des Virtual Try-Ons. Bilder werden nicht dauerhaft gespeichert und nach der Session gelöscht.
                </p>
              </section>
              <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">2. Affiliate-Links & Tracking</h3>
                <p className="text-base leading-relaxed">
                  Diese App nutzt Affiliate-Partnerprogramme. Wenn Sie auf einen Shop-Link klicken, wird ein Cookie gesetzt, um den Kauf unserer App zuzuordnen.
                </p>
              </section>
              <section className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">3. KI-Verarbeitung</h3>
                <p className="text-base leading-relaxed">
                  Ihre Bilddaten werden verschlüsselt an die Google Gemini API übertragen, um die Analyse durchzuführen. Es findet keine Identitätsfeststellung statt.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
