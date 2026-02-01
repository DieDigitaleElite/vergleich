
import React, { useState } from 'react';
import { Outfit } from '../types';
import { Sparkles, ShoppingCart, ChevronDown, ChevronUp, ExternalLink, TrendingUp, AlertCircle } from 'lucide-react';

interface OutfitGridProps {
  outfits: Outfit[];
  onTryOn: (outfit: Outfit) => void;
  selectedId?: string;
}

const OutfitGrid: React.FC<OutfitGridProps> = ({ outfits, onTryOn, selectedId }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getFashionImg = (item: any, idx: number) => {
    // Generiert ein passendes Bild basierend auf dem Keyword
    const keyword = encodeURIComponent(item.imageKeyword || item.name || 'fashion');
    return `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80&sig=${idx}&fashion=${keyword}`;
  };

  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="space-y-24">
      {outfits.map((outfit) => (
        <div key={outfit.id} className="group pb-24 border-b border-zinc-100 last:border-0">
          <div className="flex flex-col xl:flex-row gap-16">
            {/* Visual Part */}
            <div className="xl:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                {outfit.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="aspect-[3/4] bg-zinc-50 overflow-hidden relative shadow-sm border border-zinc-100 rounded-sm">
                    <img 
                      src={getFashionImg(item, idx)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-[2s] ease-out grayscale-[0.1] group-hover:grayscale-0"
                      alt={item.name}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest border-t">
                      {item.brand || 'Premium Selection'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-2xl border border-zinc-100 text-center min-w-[120px]">
                <p className="text-3xl font-serif text-black">{outfit.matchScore}%</p>
                <p className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold mt-1">Match Rate</p>
              </div>
            </div>

            {/* Content Part */}
            <div className="xl:w-1/2 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-3 py-1 uppercase tracking-widest flex items-center">
                    <TrendingUp className="w-3 h-3 mr-2" /> Trending Now
                  </span>
                  <span className="text-zinc-400 text-[9px] font-bold uppercase tracking-widest">
                    Gerade {outfit.viewerCount} Views
                  </span>
                </div>
                <h3 className="text-5xl font-serif tracking-tighter leading-tight">{outfit.name}</h3>
                <p className="text-zinc-500 italic text-lg font-light leading-relaxed">"{outfit.reasoning}"</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => onTryOn(outfit)}
                  className="flex-1 bg-black text-white py-6 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-zinc-800 transition shadow-xl flex items-center justify-center gap-3 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> <span>Anprobieren</span>
                </button>
                <button 
                  onClick={() => setExpandedId(expandedId === outfit.id ? null : outfit.id)}
                  className="px-8 border border-zinc-200 py-6 text-[10px] font-bold uppercase tracking-widest hover:border-black transition flex items-center gap-2 bg-white"
                >
                  {expandedId === outfit.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Shop View */}
          {expandedId === outfit.id && (
            <div className="mt-16 bg-zinc-50 p-12 animate-in slide-in-from-top-8 duration-700 rounded-sm">
              <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-4">
                <h4 className="text-2xl font-serif tracking-tight">Einkaufsliste</h4>
                <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  <AlertCircle className="w-3 h-3 mr-2" /> Verfügbarkeit bei Partnern geprüft
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {outfit.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 border border-zinc-100 flex gap-6 hover:shadow-2xl transition group/item">
                    <div className="w-32 aspect-[3/4] overflow-hidden bg-zinc-100 shrink-0 shadow-sm rounded-sm">
                      <img 
                        src={getFashionImg(item, idx + 10)} 
                        className="w-full h-full object-cover group-hover/item:scale-110 transition duration-700" 
                        alt={item.name} 
                      />
                    </div>
                    <div className="flex flex-col justify-between py-1 flex-grow">
                      <div>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.brand || 'Fashion Shop'}</p>
                        <h5 className="font-bold text-lg mb-2 leading-tight">{item.name}</h5>
                        <p className="text-2xl font-serif">{item.price || 'Bestpreis'}</p>
                      </div>
                      <a 
                        href={item.affiliateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-black text-white text-center py-4 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition"
                      >
                        <ShoppingCart className="w-3 h-3" /> <span>Zum Shop</span> <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OutfitGrid;
