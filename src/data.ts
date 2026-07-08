import { PhrasebookItem } from "./types";

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "auto", name: "Detect language" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ko", name: "Korean" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" }
];

export const QUICK_HISTORY_PAIRS = [
  { source: "English", target: "Spanish" },
  { source: "German", target: "English" },
  { source: "French", target: "Japanese" }
];

export const DEFAULT_PHRASEBOOK: PhrasebookItem[] = [
  // Greetings
  {
    id: "g1",
    category: "Greetings",
    english: "Hello, nice to meet you. How are you doing today?",
    translation: "Hola, encantado de conocerte. ¿Cómo estás hoy?",
    targetLang: "Spanish"
  },
  {
    id: "g2",
    category: "Greetings",
    english: "Good morning! I wish you a very productive day.",
    translation: "Guten Morgen! Ich wünsche Ihnen einen sehr produktiven Tag.",
    targetLang: "German"
  },
  {
    id: "g3",
    category: "Greetings",
    english: "Thank you very much for your kind help and cooperation.",
    translation: "Merci beaucoup pour votre aimable aide et votre coopération.",
    targetLang: "French"
  },
  
  // Business
  {
    id: "b1",
    category: "Business",
    english: "Please let me know if you have any questions about the proposal.",
    translation: "Por favor, házmame saber si tienes alguna pregunta sobre la propuesta.",
    targetLang: "Spanish"
  },
  {
    id: "b2",
    category: "Business",
    english: "We look forward to establishing a mutually beneficial partnership.",
    translation: "Nous sommes impatients d'établir un partenariat mutuellement bénéfique.",
    targetLang: "French"
  },
  {
    id: "b3",
    category: "Business",
    english: "Could we reschedule our meeting to tomorrow afternoon?",
    translation: "私たちの会議を明日の午後に再スケジュールしていただけますか？",
    targetLang: "Japanese"
  },

  // Travel
  {
    id: "t1",
    category: "Travel",
    english: "Excuse me, where is the nearest train station and how do I get there?",
    translation: "Disculpe, ¿dónde está la estación de tren más cercana y cómo llego allí?",
    targetLang: "Spanish"
  },
  {
    id: "t2",
    category: "Travel",
    english: "Could you recommend a traditional local restaurant near here?",
    translation: "この近くで伝統的な地元のレストランを推薦していただけますか？",
    targetLang: "Japanese"
  },
  {
    id: "t3",
    category: "Travel",
    english: "I would like to check-in my baggage and obtain a boarding pass, please.",
    translation: "Je voudrais enregistrer mes bagages et obtenir une carte d'embarquement, s'il vous plaît.",
    targetLang: "French"
  },

  // Tech / Conversation
  {
    id: "tc1",
    category: "Technology",
    english: "Artificial intelligence is rapidly changing the software engineering industry.",
    translation: "Die künstliche Intelligenz verändert die Software-Engineering-Branche rasant.",
    targetLang: "German"
  },
  {
    id: "tc2",
    category: "Technology",
    english: "Please upload your source document and click the translate button.",
    translation: "Por favor, sube tu documento original y haz clic en el botón de traducir.",
    targetLang: "Spanish"
  }
];
