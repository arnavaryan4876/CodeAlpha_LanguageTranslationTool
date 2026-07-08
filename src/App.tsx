import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeftRight, 
  Trash2, 
  Mic, 
  Volume2, 
  Copy, 
  Star, 
  X, 
  Check, 
  ArrowRight, 
  Upload, 
  Globe, 
  Sparkles, 
  BookOpen, 
  History as HistoryIcon,
  ShieldAlert,
  HelpCircle,
  FileText
} from "lucide-react";

import { TranslationItem, DictionaryItem } from "./types";
import { SUPPORTED_LANGUAGES, QUICK_HISTORY_PAIRS } from "./data";

// Sub-components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LanguageSelector from "./components/LanguageSelector";
import BentoGrid from "./components/BentoGrid";
import HistoryPanel from "./components/HistoryPanel";
import SavedPanel from "./components/SavedPanel";
import PhrasebookPanel from "./components/PhrasebookPanel";
import SettingsModal from "./components/SettingsModal";

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>("translate");
  const [currentMode, setCurrentMode] = useState<string>("text"); // "text" | "documents" | "websites"
  
  // Translation Core States
  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("Spanish");
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const [grammarNotes, setGrammarNotes] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<DictionaryItem[]>([]);
  
  // App UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // History & Saved states
  const [historyList, setHistoryList] = useState<TranslationItem[]>([]);
  
  // Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    speechRate: 1.0,
    speechPitch: 1.0,
    defaultTargetLang: "Spanish",
    enableGrammarNotes: true,
    enableAutoDictionary: true
  });

  // Load state on mount
  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem("linguistpro_history");
    if (savedHistory) {
      try {
        setHistoryList(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    } else {
      // Seed with some default professional records to keep visual elegance on first load
      const initialSeed: TranslationItem[] = [
        {
          id: "seed-1",
          inputText: "Could you please review the contract and send the signed copy by tomorrow evening?",
          translatedText: "¿Podría revisar el contrato y enviar la copia firmada para mañana por la tarde?",
          sourceLang: "English",
          targetLang: "Spanish",
          detectedLanguage: "English",
          timestamp: Date.now() - 3600000 * 2,
          isSaved: true,
          grammarNotes: ["Polite conditional structure verified.", "Accents added correctly for 'Podría' and '¿Cómo?'."],
          dictionary: [
            { word: "review", definition: "To inspect or look over carefully.", synonyms: ["examine", "inspect"], usageExample: "Please review the documents before signing." }
          ]
        },
        {
          id: "seed-2",
          inputText: "Wir freuen uns auf eine erfolgreiche Zusammenarbeit mit Ihrem Team.",
          translatedText: "We look forward to a successful collaboration with your team.",
          sourceLang: "Detect language",
          targetLang: "English",
          detectedLanguage: "German",
          detectedLanguageCode: "de",
          timestamp: Date.now() - 3600000 * 5,
          isSaved: false,
          grammarNotes: ["Standard business expression verified.", "Preposition 'auf' mapped correctly to 'look forward to'."],
          dictionary: [
            { word: "Zusammenarbeit", definition: "The act of working together; cooperation.", synonyms: ["cooperation", "collaboration"], usageExample: "Collaboration brings better results." }
          ]
        }
      ];
      setHistoryList(initialSeed);
      localStorage.setItem("linguistpro_history", JSON.stringify(initialSeed));
    }

    // Load settings
    const savedSettings = localStorage.getItem("linguistpro_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setTargetLang(parsed.defaultTargetLang);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save history to localstorage on change
  const saveHistory = (newList: TranslationItem[]) => {
    setHistoryList(newList);
    localStorage.setItem("linguistpro_history", JSON.stringify(newList));
  };

  // Save settings on change
  useEffect(() => {
    if (settings) {
      localStorage.setItem("linguistpro_settings", JSON.stringify(settings));
    }
  }, [settings]);

  // Execute Translation Core Action
  const handleTranslate = async () => {
    if (!inputText || !inputText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          sourceLang: sourceLang === "auto" ? "Detect language" : sourceLang,
          targetLang: targetLang
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Translation request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      setTranslatedText(data.translatedText);
      setDetectedLanguage(data.detectedLanguage || "");
      setGrammarNotes(data.grammarNotes || []);
      setDictionary(data.dictionary || []);

      // Check if item is already in history to prevent duplicates
      const isDuplicate = historyList.some(item => 
        item.inputText === inputText && 
        item.targetLang === targetLang
      );

      if (!isDuplicate) {
        // Construct translation item for log
        const newItem: TranslationItem = {
          id: "trans-" + Date.now(),
          inputText: inputText,
          translatedText: data.translatedText,
          sourceLang: sourceLang === "auto" ? "Detect language" : sourceLang,
          targetLang: targetLang,
          detectedLanguage: data.detectedLanguage,
          detectedLanguageCode: data.detectedLanguageCode,
          timestamp: Date.now(),
          isSaved: false,
          grammarNotes: data.grammarNotes,
          dictionary: data.dictionary
        };

        const updatedHistory = [newItem, ...historyList].slice(0, 50); // limit 50 logs
        saveHistory(updatedHistory);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not complete translation. Please ensure your Gemini API Key is configured in Secrets panel.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick swap source and target languages
  const handleSwapLanguages = () => {
    if (sourceLang === "auto") {
      // If auto-detected language is known, swap to it
      if (detectedLanguage) {
        const found = SUPPORTED_LANGUAGES.find(l => l.name.toLowerCase() === detectedLanguage.toLowerCase());
        if (found) {
          setSourceLang(targetLang);
          setTargetLang(found.name);
          setInputText(translatedText);
          setTranslatedText(inputText);
          return;
        }
      }
      // If unknown, default English/Spanish swap
      setSourceLang(targetLang);
      setTargetLang("English");
      setInputText(translatedText);
      setTranslatedText(inputText);
      return;
    }
    
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  // Delete log item
  const handleDeleteHistory = (id: string) => {
    const newList = historyList.filter(item => item.id !== id);
    saveHistory(newList);
  };

  // Star / unstar items
  const handleToggleSave = (id: string) => {
    const newList = historyList.map(item => {
      if (item.id === id) {
        return { ...item, isSaved: !item.isSaved };
      }
      return item;
    });
    saveHistory(newList);
  };

  // Clear all history logs
  const handleClearAllHistory = () => {
    if (window.confirm("Are you sure you want to wipe all translation logs?")) {
      saveHistory([]);
    }
  };

  // Load previous log item into translator
  const handleSelectHistoryItem = (item: TranslationItem) => {
    setInputText(item.inputText);
    setTranslatedText(item.translatedText);
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    if (item.detectedLanguage) {
      setDetectedLanguage(item.detectedLanguage);
    }
    if (item.grammarNotes) setGrammarNotes(item.grammarNotes);
    if (item.dictionary) setDictionary(item.dictionary);
    setActiveTab("translate");
  };

  // Preset phrase selection handler
  const handleSelectPhrasebookItem = (english: string, translation: string, targetLanguage: string) => {
    setInputText(english);
    setTranslatedText(translation);
    setSourceLang("English");
    setTargetLang(targetLanguage);
    setGrammarNotes([]);
    setDictionary([]);
    setActiveTab("translate");
  };

  // Real or mock microphone dictation action
  const handleDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // Try to find correct speech language code
      const currentSource = SUPPORTED_LANGUAGES.find(l => l.name === sourceLang);
      recognition.lang = currentSource && currentSource.code !== "auto" ? currentSource.code : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onerror = (e: any) => {
        console.error("Speech Recognition Error", e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputText(prev => prev ? prev + " " + text : text);
      };

      recognition.start();
    } else {
      // Mock dictation helper
      setIsRecording(true);
      setTimeout(() => {
        const presets = [
          "LinguistPro helps businesses around the world interact smoothly across multiple language barriers.",
          "Our system performs high-accuracy grammar checks and dictionary lookups automatically.",
          "Good morning, I would like to schedule a professional consultation for tomorrow afternoon."
        ];
        const randomPhrase = presets[Math.floor(Math.random() * presets.length)];
        setInputText(prev => prev ? prev + " " + randomPhrase : randomPhrase);
        setIsRecording(false);
      }, 2500);
    }
  };

  // Text to Speech playback action
  const handleSpeak = (textToSpeak: string, languageName: string) => {
    if (!textToSpeak) return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel(); // stop previous speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = settings.speechRate;
    utterance.pitch = settings.speechPitch;

    // Map languages to standard voice code
    const voicesCodeMap: Record<string, string> = {
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      German: "de-DE",
      Japanese: "ja-JP",
      Chinese: "zh-CN",
      Italian: "it-IT",
      Portuguese: "pt-PT",
      Korean: "ko-KR",
      Russian: "ru-RU",
      Arabic: "ar-SA",
      Hindi: "hi-IN",
      Dutch: "nl-NL"
    };

    const targetCode = voicesCodeMap[languageName] || "en-US";
    utterance.lang = targetCode;

    // Optional: find a local voice matched to target
    const voices = synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(targetCode));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    synth.speak(utterance);
  };

  // Clipboard copy helper
  const handleCopyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Clear translation input boxes
  const handleClearInputs = () => {
    setInputText("");
    setTranslatedText("");
    setGrammarNotes([]);
    setDictionary([]);
    setDetectedLanguage("");
    setError(null);
  };

  // Handle Drag-and-drop document upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setCurrentMode("text"); // slide back to translate box
    };
    reader.readAsText(file);
  };

  // Fetch and load websites text content
  const handleWebFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput || !urlInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to fetch web content. Status: ${response.status}`);
      }

      const data = await response.json();
      setInputText(data.text);
      setCurrentMode("text"); // slide back to translator
      setUrlInput("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse website paragraphs. Please ensure the target URL is accessible.");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset chip clicks
  const handleQuickPresetPair = (source: string, target: string) => {
    setSourceLang(source);
    setTargetLang(target);
  };

  // Star current active translation
  const handleStarCurrentActive = () => {
    if (!inputText || !translatedText) return;
    
    // Find current translation in history
    const foundIdx = historyList.findIndex(item => 
      item.inputText === inputText && 
      item.translatedText === translatedText
    );

    if (foundIdx !== -1) {
      const newList = [...historyList];
      newList[foundIdx].isSaved = !newList[foundIdx].isSaved;
      saveHistory(newList);
    } else {
      // Create new save pair on the fly
      const newItem: TranslationItem = {
        id: "trans-" + Date.now(),
        inputText,
        translatedText,
        sourceLang,
        targetLang,
        detectedLanguage,
        timestamp: Date.now(),
        isSaved: true,
        grammarNotes,
        dictionary
      };
      saveHistory([newItem, ...historyList]);
    }
  };

  // Check if current active translation is saved
  const isCurrentActiveSaved = historyList.some(item => 
    item.inputText === inputText && 
    item.translatedText === translatedText && 
    item.isSaved
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F5F7]">
      {/* SideNavBar Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#faf9ff] relative overflow-hidden">
        
        {/* Header App Bar */}
        <Header 
          currentMode={currentMode} 
          setCurrentMode={setCurrentMode} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Translation panel canvas */}
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-8 lg:py-10 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            
            {/* Display active panel dynamically */}
            <AnimatePresence mode="wait">
              {activeTab === "translate" && (
                <motion.div
                  key="translate"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  
                  {/* Mode Selector Panel for Tablets & Mobile */}
                  <div className="lg:hidden flex gap-2 border-b border-[#c3c6d6] pb-2 mb-4">
                    {["text", "documents", "websites"].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setCurrentMode(mode)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                          currentMode === mode 
                            ? "bg-primary text-white" 
                            : "bg-white text-[#535f73] border border-[#c3c6d6]"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  {/* Errors alerts */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-bold">Linguistic Engine Notice</p>
                        <p className="opacity-90">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Mode: TEXT translator */}
                  {currentMode === "text" && (
                    <>
                      {/* Language Preset Chips */}
                      <div className="flex flex-wrap gap-2">
                        {QUICK_HISTORY_PAIRS.map((pair, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPresetPair(pair.source, pair.target)}
                            className="bg-[#EBECF0] hover:bg-[#c3c6d6] text-[#434654] px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                          >
                            {pair.source} → {pair.target}
                          </button>
                        ))}
                      </div>

                      {/* Split-Pane Translation Cards */}
                      <div className="bg-white border border-[#c3c6d6] rounded-xl flex flex-col md:flex-row min-h-[420px] overflow-hidden shadow-xs relative">
                        
                        {/* LEFT: Source Pane */}
                        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#c3c6d6] p-6">
                          <div className="flex items-center justify-between mb-4">
                            <LanguageSelector 
                              selectedCode={sourceLang === "Detect language" ? "auto" : sourceLang}
                              onChange={(lang) => setSourceLang(lang.code === "auto" ? "Detect language" : lang.name)}
                              languages={SUPPORTED_LANGUAGES}
                            />
                            {inputText && (
                              <button
                                onClick={handleClearInputs}
                                className="text-[#434654] hover:bg-[#f1f3ff] p-1.5 rounded-full transition-colors cursor-pointer"
                                title="Clear original text"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value.slice(0, 5000))}
                            className="flex-1 w-full border-none focus:ring-0 resize-none text-lg p-0 placeholder-[#737685] text-[#051a3e] outline-none min-h-[180px] custom-scrollbar bg-transparent"
                            placeholder="Type or paste your text here..."
                          />

                          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between shrink-0">
                            <span className="text-xs text-[#737685] font-semibold">
                              {inputText.length} / 5000
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={handleDictation}
                                className={`p-2 rounded-full transition-all cursor-pointer ${
                                  isRecording 
                                    ? "bg-red-500 text-white animate-pulse" 
                                    : "text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b]"
                                }`}
                                title={isRecording ? "Listening... click to stop" : "Voice input (Dictation)"}
                              >
                                <Mic className="w-4.5 h-4.5" />
                              </button>
                              <button
                                onClick={() => handleSpeak(inputText, sourceLang === "auto" ? detectedLanguage : sourceLang)}
                                disabled={!inputText}
                                className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                title="Listen to original text"
                              >
                                <Volume2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Middle Action: Swap languages in-between */}
                        <div className="relative flex md:items-center justify-center -my-3.5 md:my-0 md:-mx-4 z-20 shrink-0">
                          <button
                            onClick={handleSwapLanguages}
                            className="bg-white border border-[#c3c6d6] text-primary p-2.5 rounded-full shadow-sm hover:shadow-md hover:border-primary hover:text-[#003d9b] active:scale-95 transition-all transform md:rotate-0 rotate-90 cursor-pointer"
                            title="Swap languages"
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* RIGHT: Target translation output pane */}
                        <div className="flex-1 flex flex-col p-6 bg-[#faf9ff]">
                          <div className="flex items-center justify-between mb-4">
                            <LanguageSelector 
                              selectedCode={targetLang}
                              onChange={(lang) => setTargetLang(lang.name)}
                              languages={SUPPORTED_LANGUAGES}
                              excludeAuto={true}
                            />
                            {sourceLang === "auto" && detectedLanguage && (
                              <span className="text-xs bg-[#e9edff] text-primary px-2.5 py-1 rounded-full font-bold">
                                Auto-Detected: {detectedLanguage}
                              </span>
                            )}
                          </div>

                          {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center min-h-[180px]">
                              <div className="w-8 h-8 border-4 border-[#c3c6d6] border-t-primary rounded-full animate-spin" />
                              <span className="text-xs text-[#737685] font-semibold mt-3">Executing AI Translation...</span>
                            </div>
                          ) : (
                            <div 
                              className={`flex-1 w-full text-lg text-[#051a3e] select-text overflow-y-auto whitespace-pre-wrap min-h-[180px] custom-scrollbar ${
                                !translatedText ? "text-gray-400 italic" : "font-semibold"
                              }`}
                            >
                              {translatedText || "Translation..."}
                            </div>
                          )}

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
                            {translatedText && (
                              <>
                                <button
                                  onClick={() => handleCopyToClipboard(translatedText)}
                                  className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors relative cursor-pointer"
                                  title="Copy translation"
                                >
                                  {copiedText ? (
                                    <Check className="w-4.5 h-4.5 text-green-600" />
                                  ) : (
                                    <Copy className="w-4.5 h-4.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleSpeak(translatedText, targetLang)}
                                  className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors cursor-pointer"
                                  title="Listen to translation"
                                >
                                  <Volume2 className="w-4.5 h-4.5" />
                                </button>
                                <button
                                  onClick={handleStarCurrentActive}
                                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                                    isCurrentActiveSaved
                                      ? "text-yellow-500 hover:bg-yellow-50"
                                      : "text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b]"
                                  }`}
                                  title={isCurrentActiveSaved ? "Starred" : "Star translation"}
                                >
                                  <Star className="w-4.5 h-4.5" fill={isCurrentActiveSaved ? "currentColor" : "none"} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Translate Trigger Button */}
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={handleTranslate}
                          disabled={isLoading || !inputText || !inputText.trim()}
                          className="bg-[#003d9b] text-white px-10 py-4 rounded-xl font-bold shadow-md hover:bg-primary hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none transition-all flex items-center gap-3 group active:scale-95 cursor-pointer text-sm"
                        >
                          {isLoading ? "Analyzing Text..." : "Translate"}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      {/* Extra Bento Grid Analysis */}
                      <BentoGrid 
                        grammarNotes={grammarNotes} 
                        dictionary={dictionary} 
                        translatedText={translatedText}
                      />
                    </>
                  )}

                  {/* Mode: DOCUMENTS drag and drop */}
                  {currentMode === "documents" && (
                    <div className="bg-white border border-[#c3c6d6] rounded-xl p-12 text-center max-w-2xl mx-auto shadow-xs">
                      <div className="w-16 h-16 bg-[#f1f3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-[#003d9b]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#051a3e] mb-1">Upload Source Document</h3>
                      <p className="text-sm text-[#737685] mb-6">
                        Support TXT, MD, or JSON text files. Drag & drop or select manually to instantly parse and translate.
                      </p>
                      
                      <label className="inline-block bg-[#003d9b] text-white px-6 py-3 rounded-xl font-bold hover:bg-primary active:scale-95 transition-all cursor-pointer text-sm shadow-sm">
                        Select File
                        <input
                          type="file"
                          accept=".txt,.md,.json,.js,.ts"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      
                      <div className="mt-8 border-t border-gray-100 pt-6 grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#003d9b] mt-0.5 shrink-0" />
                          <span className="text-xs text-[#434654]">Full structure preserved</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#003d9b] mt-0.5 shrink-0" />
                          <span className="text-xs text-[#434654]">AI context parsing</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode: WEBSITES translator */}
                  {currentMode === "websites" && (
                    <div className="bg-white border border-[#c3c6d6] rounded-xl p-10 max-w-2xl mx-auto shadow-xs">
                      <div className="w-16 h-16 bg-[#f1f3ff] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-[#003d9b]" />
                      </div>
                      <h3 className="text-lg font-bold text-center text-[#051a3e] mb-1">Translate Web Page</h3>
                      <p className="text-sm text-center text-[#737685] mb-6">
                        Enter any web address. Our engine will fetch the public readable sections and bring them into the translator box.
                      </p>
                      
                      <form onSubmit={handleWebFetch} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://example.com/article"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 border border-[#c3c6d6] rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white text-[#051a3e]"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="bg-[#003d9b] hover:bg-primary text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors cursor-pointer shrink-0"
                        >
                          {isLoading ? "Fetching..." : "Fetch"}
                        </button>
                      </form>
                      
                      <div className="mt-6 flex justify-center gap-6 text-[#737685] text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Preserves articles</span>
                        <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Filters ads</span>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

              {activeTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <HistoryPanel
                    history={historyList}
                    onSelect={handleSelectHistoryItem}
                    onDelete={handleDeleteHistory}
                    onToggleSave={handleToggleSave}
                    onClearAll={handleClearAllHistory}
                  />
                </motion.div>
              )}

              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <SavedPanel
                    history={historyList}
                    onSelect={handleSelectHistoryItem}
                    onToggleSave={handleToggleSave}
                    onSpeak={handleSpeak}
                  />
                </motion.div>
              )}

              {activeTab === "phrasebook" && (
                <motion.div
                  key="phrasebook"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <PhrasebookPanel onSelectPhrase={handleSelectPhrasebookItem} />
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Mobile bottom navigation bar */}
        <nav className="lg:hidden flex justify-around items-center bg-white border-t border-[#c3c6d6] h-16 shrink-0">
          <button
            onClick={() => setActiveTab("translate")}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer w-1/4 h-full ${
              activeTab === "translate" ? "text-primary" : "text-[#737685]"
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-[10px] font-bold">Translate</span>
          </button>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer w-1/4 h-full ${
              activeTab === "history" ? "text-primary" : "text-[#737685]"
            }`}
          >
            <HistoryIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">History</span>
          </button>
          
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer w-1/4 h-full ${
              activeTab === "saved" ? "text-primary" : "text-[#737685]"
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="text-[10px] font-bold">Saved</span>
          </button>
          
          <button
            onClick={() => setActiveTab("phrasebook")}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer w-1/4 h-full ${
              activeTab === "phrasebook" ? "text-primary" : "text-[#737685]"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold">Phrasebook</span>
          </button>
        </nav>

        {/* Professional Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          setSettings={setSettings}
        />

      </main>
    </div>
  );
}
