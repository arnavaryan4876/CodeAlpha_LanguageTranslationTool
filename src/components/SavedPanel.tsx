import React, { useState } from "react";
import { Search, Star, Copy, Volume2, ArrowLeftRight, Check, Languages } from "lucide-react";
import { TranslationItem } from "../types";

interface SavedPanelProps {
  history: TranslationItem[];
  onSelect: (item: TranslationItem) => void;
  onToggleSave: (id: string) => void;
  onSpeak: (text: string, lang: string) => void;
}

export default function SavedPanel({
  history,
  onSelect,
  onToggleSave,
  onSpeak
}: SavedPanelProps) {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const savedItems = history.filter((item) => item.isSaved);

  const filtered = savedItems.filter(
    (item) =>
      item.inputText.toLowerCase().includes(search.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6" id="saved-panel-container">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#051a3e] flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          Saved Translations
        </h2>
        <p className="text-sm text-[#434654]">Access your starred translation cards and custom phrases</p>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-3 flex items-center gap-3 mb-6 shadow-xs">
        <Search className="w-5 h-5 text-[#737685]" />
        <input
          type="text"
          placeholder="Search saved phrases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm border-none outline-none focus:ring-0 text-[#051a3e]"
        />
      </div>

      {/* Saved Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#c3c6d6] rounded-xl p-12 text-center shadow-xs">
          <Star className="w-12 h-12 text-yellow-500/20 mx-auto mb-3" />
          <p className="text-base font-semibold text-[#051a3e]">No saved phrases</p>
          <p className="text-sm text-[#737685] mt-1">
            {search ? "No results match your search query." : "Click the star icon on any translation to save it here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#c3c6d6] hover:border-primary rounded-xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between gap-4"
            >
              <div>
                {/* Languages Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#434654]">
                    <span>{item.sourceLang === "Detect language" && item.detectedLanguage ? item.detectedLanguage : item.sourceLang}</span>
                    <ArrowLeftRight className="w-3 h-3 text-[#737685]" />
                    <span className="text-[#003d9b]">{item.targetLang}</span>
                  </div>
                  <button
                    onClick={() => onToggleSave(item.id)}
                    className="p-1 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors cursor-pointer"
                  >
                    <Star className="w-4.5 h-4.5 fill-yellow-500" />
                  </button>
                </div>

                {/* Main Card Content */}
                <div 
                  onClick={() => onSelect(item)}
                  className="cursor-pointer space-y-2 group"
                >
                  <p className="text-sm font-medium text-[#051a3e] line-clamp-3 group-hover:text-primary transition-colors">
                    {item.inputText}
                  </p>
                  <div className="border-t border-[#f1f3ff] pt-2 mt-2">
                    <p className="text-sm font-semibold text-[#003d9b] line-clamp-3">
                      {item.translatedText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Utilities */}
              <div className="flex justify-between items-center pt-2 border-t border-[#faf9ff]">
                <button
                  onClick={() => onSelect(item)}
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  Open in translator
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSpeak(item.translatedText, item.targetLang)}
                    className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors cursor-pointer"
                    title="Listen to translation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(item.id, item.translatedText)}
                    className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors relative cursor-pointer"
                    title="Copy translation"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
