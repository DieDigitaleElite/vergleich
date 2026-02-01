
import React, { useRef } from 'react';
import { Upload, Camera, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeroProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Hero: React.FC<HeroProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center text-center py-12 md:py-24 max-w-5xl mx-auto px-4">
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-10 animate-bounce">
        <Sparkles className="w-3 h-3 text-black" />
        <span>Next-Gen Virtual Fashion</span>
      </div>
      
      <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-none tracking-tighter">
        Perfekter Style. <br />
        <span className="text-gray-300 italic">Maßgeschneidert</span> <br />
        per Klick.
      </h1>
      
      <p className="text-xl text-gray-400 mb-14 max-w-2xl font-light leading-relaxed">
        Lade ein Foto hoch. Unsere KI analysiert deine Silhouette und projiziert High-End Fashion direkt auf dein Bild. Entdecke Outfits, die wirklich passen.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex items-center justify-center space-x-3 bg-black text-white px-10 py-6 overflow-hidden transition-all hover:pr-14"
        >
          <Upload className="w-5 h-5" />
          <span className="font-bold uppercase tracking-widest text-sm">Look kreieren</span>
          <ArrowRight className="absolute right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
        </button>
        
        <button className="flex items-center justify-center space-x-3 border border-black/10 px-10 py-6 hover:bg-gray-50 transition font-bold uppercase tracking-widest text-sm">
          <Camera className="w-5 h-5" />
          <span>Kamera</span>
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onUpload} 
        className="hidden" 
        accept="image/*" 
      />

      <div className="mt-20 flex flex-wrap items-center justify-center gap-12 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>Anonym & Sicher</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>Körperanalyse</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-black" />
          <span>Virtual Try-On</span>
        </div>
      </div>

      <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </div>
  );
};

export default Hero;
