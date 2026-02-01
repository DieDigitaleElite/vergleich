
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
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import CookieBanner from './components/CookieBanner';

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
      if (!process.env.API_KEY) {
        throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Step 1: Body Analysis (Strict JSON)
      const analysisPrompt = `Analysiere dieses Foto für eine Modeberatung. Bestimme Körperform (shape), Hautunterton (skinTone), geschätzte Größe (heightEstimate) und den aktuellen Stil-Vibe (baseStyle). Schlage außerdem ein passendes Make-up (makeupAdvice) und passende Farben (undertoneColors als Hex-Codes) vor. Antworte strikt in JSON-Format ohne Markdown-Wrapper.`;
      
      const analysisRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: base64.split(',')[1] } }, { text: analysisPrompt }] },
        config: { responseMimeType: 'application/json' }
      });
      
      const analysisData = JSON.parse(analysisRes.text || '{}') as BodyAnalysis;
      setAnalysis(analysisData);

      setLoadingMessage('Suche passende Trends in Echtzeit...');
      
      // Step 2: Search for real products (Search Grounding enabled)
      // Note: We avoid responseMimeType: 'application/json' here because it often conflicts with googleSearch tool metadata
      const searchPrompt = `Suche basierend auf diesem Profil: ${JSON.stringify(analysisData)} nach 3 real existierenden Outfits bei Zalando, H&M oder AboutYou. 
      Antworte im JSON Format: {"outfits": [{"name": "...", "reasoning": "...", "matchScore": 95, "items": [{"name": "...", "brand": "...", "price": "...", "merchantUrl": "...", "imageKeyword": "..."}]}]}. 
      Gib NUR das nackte JSON zurück, keinen Text davor oder danach.`;

      const searchRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: searchPrompt,
        config: { 
          tools: [{ googleSearch: {} }]
        }
      });

      // Extract text and try to parse JSON manually from potential Markdown blocks
      const rawText = searchRes.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const rawData = JSON.parse(jsonMatch ? jsonMatch[0] : '{"outfits":[]}');
      
      // Extract Search Sources (Grounding Chunks)
      const chunks = searchRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
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
      console.error("VOGUE AI Workflow Error:", e);
      let msg = "Verbindung fehlgeschlagen. Bitte versuche es gleich noch einmal.";
      if (e.message?.includes("429")) msg = "Limit erreicht (1.500/Tag). Bitte kurz warten.";
      if (e.message === "API_KEY_MISSING") msg = "API Key nicht gefunden. Prüfe die Vercel-Umgebungsvariablen.";
      
      setError(msg);
      setAppState(AppState.IDLE);
    }
  };

  const handleTryOn = async (outfit: Outfit) => {
    if (!userImage) return;
    setSelectedOutfit(outfit);
    setAppState(AppState.TRYING_ON);
    setLoadingMessage('Visualisiere Deinen neuen Look...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let makeupInstruction = "";
      if (applyMakeup && analysis?.makeupAdvice) {
        makeupInstruction = ` Wende zusätzlich ein professionelles Make-up an. Stil: ${analysis.makeupAdvice}.`;
      }

      const prompt = `Virtual Try-On: Ziehe der Person im Bild dieses Outfit an: ${outfit.name}. Teile: ${outfit.items.map(i => i.name).join(', ')}.${makeupInstruction} Bewahre die Identität perfekt.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { mimeType: 'image/jpeg', data: userImage.split(',')[1] } }, { text: prompt }] }
      });

      const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imgPart?.inlineData) setTryOnImage(`data:image/png;base64,${imgPart.inlineData.data}`);
    } catch (e) {
      console.error("Try-On Error:", e);
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
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-2 border-black rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif italic text-center max-w-md">{loadingMessage}</h2>
          </div>
        )}

        {appState === AppState.RESULTS && analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in duration-700">
            <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-12">
              <AnalysisCard 
                analysis={analysis} 
                userImage={userImage} 
                applyMakeup={applyMakeup}
                onToggleMakeup={() => setApplyMakeup(!applyMakeup)}
              />
              {tryOnImage && (
                <TryOnViewer original={userImage} result={tryOnImage} outfitName={selectedOutfit?.name || ''} />
              )}
            </div>
            <div className="lg:col-span-8">
              <header className="mb-16 border-b pb-8 flex justify-between items-end">
                <div>
                  <h2 className="text-5xl font-serif tracking-tighter mb-2">Curated for You.</h2>
                  <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Echtzeit-Suche basierend auf Deinem Profil</p>
                </div>
                <button 
                  onClick={() => {
                    setAppState(AppState.IDLE);
                    setTryOnImage(null);
                    setSelectedOutfit(null);
                  }}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest hover:text-amber-600 transition"
                >
                  <RefreshCw className="w-3 h-3" /> <span>Neu starten</span>
                </button>
              </header>
              
              {outfits.length > 0 ? (
                <>
                  <OutfitGrid outfits={outfits} onTryOn={handleTryOn} selectedId={selectedOutfit?.id} />
                  
                  {groundingSources.length > 0 && (
                    <div className="mt-12 p-6 border rounded-lg bg-zinc-50">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center">
                        <Globe className="w-3 h-3 mr-2" /> Informationsquellen
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {groundingSources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-black underline flex items-center"
                          >
                            {source.title || 'Quelle ' + (i+1)}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-20 pt-10 border-t border-zinc-100">
                    <div className="flex items-start space-x-4 bg-zinc-50 p-6 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-zinc-400 mt-1" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Transparenz-Hinweis</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Die Bilderkennung ist experimentell. Produktverfügbarkeiten können variieren. Affiliate-Links finanzieren diesen Service.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-20 text-center border-2 border-dashed rounded-xl">
                  <p className="text-zinc-400 font-serif italic">Suche nach passenden Artikeln...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer onOpenLegal={(type) => setLegalType(type)} />
      <LegalModal isOpen={legalType !== null} type={legalType} onClose={() => setLegalType(null)} />
      <CookieBanner />
    </div>
  );
};

export default App;
