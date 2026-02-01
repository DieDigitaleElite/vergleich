
import React, { useState } from 'react';
import { Maximize2, Share2, Download } from 'lucide-react';

interface TryOnViewerProps {
  original: string | null;
  result: string;
  outfitName: string;
}

const TryOnViewer: React.FC<TryOnViewerProps> = ({ original, result, outfitName }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(x, 0), 100));
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-bold text-sm">Virtual Try-On: {outfitName}</h3>
        <div className="flex space-x-2">
          <Share2 className="w-4 h-4 cursor-pointer hover:text-gray-500" />
          <Download className="w-4 h-4 cursor-pointer hover:text-gray-500" />
        </div>
      </div>
      
      <div 
        className="relative aspect-[3/4] cursor-ew-resize overflow-hidden bg-gray-100"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Result Image (Filtered by slider) */}
        <img src={result} alt="Try on result" className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Original Image (Masked by slider) */}
        <div 
          className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-xl"
          style={{ width: `${sliderPos}%` }}
        >
          {original && <img src={original} alt="Original" className="w-[100vw] h-full object-cover max-w-none" />}
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          VORHER
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
          NACHHER
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-0.5 h-3 bg-gray-300"></div>
              <div className="w-0.5 h-3 bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 text-xs text-center text-gray-400">
        Ziehe den Slider, um den Vorher-Nachher-Vergleich zu sehen.
      </div>
    </div>
  );
};

export default TryOnViewer;
