
import React, { useState } from 'react';
import { Sparkles, Info, RefreshCw, ShieldCheck, Globe } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppState, BodyAnalysis, Outfit } from './types';
import { generateAffiliateLink } from './services/affiliate';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalysisCard from './components/AnalysisCard';
import OutfitGrid from './components/OutfitGrid';
import TryOnViewer from './components/TryOnViewer';
import AppFooter from './components/AppFooter';
import AppLegalModal from './components/AppLegalModal';
import AppCookieBanner from './components/AppCookieBanner';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [groundingSources, setGroundingSources] = useState<{title: string, uri: string}[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [applyMakeup, setApplyMakeup] = useState(false);
  
  const [legalType, setLegalType] = useState<'impressum' | 'datenschutz' | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base = e.target?.result as string;
      setUserImage(base);
      runWorkflow(base);
    };
    reader.readAsDataURL(file);
  };

  const runWorkflow = async (base64: string) => {
    setAppState(AppState.ANALYZING);
    setLoadingMessage('Dein Style-Profil wird generiert...');
    setError(null);
    setGroundingSources([]);

    try {
      if (!process.env.API_KEY) throw new Error("API_KEY_MISSING");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const analysisPrompt = `Analysiere dieses Foto für eine Modeberatung. Bestimme Körperform (shape), Hautunterton (skinTone), geschätzte Größe (heightEstimate) und den aktuellen Stil-Vibe (baseStyle). Schlage außerdem ein passendes Make-up (makeupAdvice) und passende Farben (undertoneColors als Hex-Codes) vor. Antworte strikt in JSON-Format ohne Markdown.`;
      
      const analysisRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64.split(',')[1] } }, { text: analysisPrompt }] },
        config: { responseMimeType: 'application/json' }
      });
      
      const analysisData = JSON.parse(analysisRes.text || '{}') as BodyAnalysis;
      setAnalysis(analysisData);

      setLoadingMessage('Suche passende Trends in Echtzeit...');
      const searchPrompt = `Suche basierend auf diesem Profil: ${JSON.stringify(analysisData)} nach 3 real existierenden Outfits bei Zalando, H&M oder AboutYou. Antworte im JSON Format: {"outfits": [{"name": "...", "reasoning": "...", "matchScore": 95, "items": [{"name": "...", "brand": "...", "price": "...", "merchantUrl": "...", "imageKeyword": "..."}]}]}. Gib NUR JSON zurück.`;

      const searchRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: searchPrompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      const rawText = searchRes.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const rawData = JSON.parse(jsonMatch ? jsonMatch[0] : '{"outfits":[]}');
      
      const chunks = searchRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.filter((c: any) => c.web).map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
      setGroundingSources(sources);

      const enrichedOutfits = (rawData.outfits || []).map((o: any, idx: number) => ({
        ...o,
        id: `search-outfit-${idx}`,
        viewerCount: Math.floor(Math.random() * 80) + 10,
        items: (o.items || []).map((item: any, i: number) => {
          const originalUrl = item.merchantUrl || `https://www.google.com/search?q=${encodeURIComponent(item.brand + ' ' + item.name)}`;
          return {
            ...item,
            id: `item-${idx}-${i}`,
            originalUrl: originalUrl,
            affiliateUrl: generateAffiliateLink(originalUrl, item.brand),
            imageUrl: `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80&fashion=${encodeURIComponent(item.imageKeyword || item.name)}`
          };
        })
      }));

      setOutfits(enrichedOutfits);
      setAppState(AppState.RESULTS);
    } catch (e: any) {
      console.error(e);
      setError("Verbindung fehlgeschlagen. Bitte prüfe deinen API-Key.");
      setAppState(AppState.IDLE);
    }
  };

  const handleTryOn = async (outfit: Outfit) => {
    if (!userImage) return;
    setSelectedOutfit(outfit);
    setAppState(AppState.TRYING_ON);
    setLoadingMessage('Visualisiere Deinen Look...');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Virtual Try-On: Ziehe der Person im Bild dieses Outfit an: ${outfit.name}. Bewahre die Identität perfekt.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: userImage.split(',')[1] } }, { text: prompt }] }
      });
      const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imgPart?.inlineData) setTryOnImage(`data:image/png;base64,${imgPart.inlineData.data}`);
    } catch (e) {
      setError("Virtual Try-On aktuell nicht verfügbar.");
    }
    setAppState(AppState.RESULTS);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 flex-grow">
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg flex justify-between items-center border border-red-100">
            <div className="flex items-center space-x-2"><Info className="w-5 h-5" /><span>{error}</span></div>
            <button onClick={() => setError(null)} className="font-bold p-2">✕</button>
          </div>
        )}

        {appState === AppState.IDLE && <Hero onUpload={handleFileUpload} />}

        {(appState === AppState.ANALYZING || appState === AppState.TRYING_ON) && (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-pulse">
            <div className="relative w-24 h-24 border-t-2 border-black rounded-full animate-spin"></div>
            <h2 className="text-3xl font-serif italic text-center max-w-md">{loadingMessage}</h2>
          </div>
        )}

        {appState === AppState.RESULTS && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in duration-700">
            <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-12">
              <AnalysisCard analysis={analysis} userImage={userImage} applyMakeup={applyMakeup} onToggleMakeup={() => setApplyMakeup(!applyMakeup)} />
              {tryOnImage && <TryOnViewer original={userImage} result={tryOnImage} outfitName={selectedOutfit?.name || ''} />}
            </div>
            <div className="lg:col-span-8">
              <header className="mb-16 border-b pb-8 flex justify-between items-end">
                <h2 className="text-5xl font-serif tracking-tighter">Curated for You.</h2>
                <button onClick={() => setAppState(AppState.IDLE)} className="text-[10px] font-bold uppercase tracking-widest hover:text-amber-600 flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Neu starten</button>
              </header>
              <OutfitGrid outfits={outfits} onTryOn={handleTryOn} selectedId={selectedOutfit?.id} />
              {groundingSources.length > 0 && (
                <div className="mt-12 p-6 border rounded-lg bg-zinc-50 flex flex-wrap gap-4">
                  {groundingSources.map((s, i) => <a key={i} href={s.uri} target="_blank" rel="noreferrer" className="text-xs text-zinc-500 underline">{s.title}</a>)}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <AppFooter onOpenLegal={(type) => setLegalType(type)} />
      <AppLegalModal isOpen={legalType !== null} type={legalType} onClose={() => setLegalType(null)} />
      <AppCookieBanner />
    </div>
  );
};

export default App;
