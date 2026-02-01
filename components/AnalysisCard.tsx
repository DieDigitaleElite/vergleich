
import React from 'react';
import { BodyAnalysis } from '../types';
import { User, Palette, Sparkles, Shield, Eye, CheckCircle2, Circle } from 'lucide-react';

interface AnalysisCardProps {
  analysis: BodyAnalysis;
  userImage: string | null;
  applyMakeup: boolean;
  onToggleMakeup: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, userImage, applyMakeup, onToggleMakeup }) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5">
      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100">
        {userImage ? (
          <img src={userImage} alt="Analysis" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Verified Silhouette</span>
          </div>
        </div>
      </div>
      
      <div className="p-8 space-y-8">
        <div>
          <h3 className="text-2xl font-serif italic mb-6">Styling Profile</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-default">
              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-black transition">
                <User className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Body Shape</span>
              </div>
              <span className="font-bold text-xs">{analysis.shape}</span>
            </div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-3 text-gray-400 group-hover:text-black transition">
                <Palette className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Skin Tone</span>
              </div>
              <span className="font-bold text-xs capitalize">{analysis.skinTone}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 flex items-center">
              <Eye className="w-3 h-3 mr-2" /> Suggested Beauty Palette
            </h4>
            <button 
              onClick={onToggleMakeup}
              className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${applyMakeup ? 'text-amber-600' : 'text-gray-400 hover:text-black'}`}
            >
              {applyMakeup ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span>Make-up anwenden</span>
            </button>
          </div>
          
          <div className="flex space-x-3 mb-4">
            {(analysis.undertoneColors || ['#E8C4A9', '#C88E6B', '#8D5E43']).map((color, i) => (
              <div key={i} className="group relative">
                <div 
                  className="w-10 h-10 rounded-full border border-black/5 shadow-inner cursor-pointer hover:scale-110 transition"
                  style={{ backgroundColor: color }}
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] opacity-0 group-hover:opacity-100 transition">{color}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-gray-500 italic">
            "{analysis.makeupAdvice || 'Kombiniere erdige Töne für einen natürlichen Look.'}"
          </p>
        </div>

        <div className="bg-zinc-900 text-white p-6 -mx-8 -mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Elite Stylist Tip</span>
          </div>
          <p className="text-sm font-light leading-relaxed">
            Dein {analysis.shape}-Typ profitiert von vertikalen Linien. Wir haben Outfits gewählt, die deine Silhouette optisch strecken. {applyMakeup && 'Das virtuelle Make-up wird beim Anprobieren automatisch appliziert.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
