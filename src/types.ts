export interface DictionaryItem {
  word: string;
  definition: string;
  synonyms?: string[];
  usageExample?: string;
}

export interface TranslationItem {
  id: string;
  inputText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedLanguage?: string;
  detectedLanguageCode?: string;
  timestamp: number;
  isSaved: boolean;
  grammarNotes?: string[];
  dictionary?: DictionaryItem[];
}

export interface SavedPhrase {
  id: string;
  inputText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedLanguage?: string;
  timestamp: number;
}

export interface PhrasebookItem {
  id: string;
  category: string;
  english: string;
  translation: string;
  targetLang: string;
}
