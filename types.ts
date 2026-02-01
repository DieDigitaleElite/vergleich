
export interface BodyAnalysis {
  shape: string;
  heightEstimate: string;
  skinTone: string;
  baseStyle: string;
  genderPresentation?: string;
  undertoneColors: string[];
  makeupAdvice: string;
}

export interface FashionItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  originalUrl: string; // Die rohe Shop-URL
  affiliateUrl: string; // Die generierte Partner-URL
  imageUrl: string;
  imageKeyword: string;
}

export interface Outfit {
  id: string;
  name: string;
  reasoning: string;
  items: FashionItem[];
  matchScore: number;
  viewerCount: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  TRYING_ON = 'TRYING_ON'
}
