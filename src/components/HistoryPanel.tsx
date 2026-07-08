import React, { useState } from "react";
import { Search, Trash2, Star, Clock, CornerDownLeft, Languages } from "lucide-react";
import { TranslationItem } from "../types";

interface HistoryPanelProps {
  history: TranslationItem[];
  onSelect: (item: TranslationItem) => void;
  onDelete: (id: string) => void;
  onToggleSave: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({
  history,
  onSelect,
  onDelete,
  onToggleSave,
  onClearAll
}: HistoryPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = history.filter(
    (item) =>
      item.inputText.toLowerCase().includes(search.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-6" id="history-panel-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#051a3e] flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Translation History
          </h2>
          <p className="text-sm text-[#434654]">Review and load your previous translation records</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All History
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-3 flex items-center gap-3 mb-6 shadow-xs">
        <Search className="w-5 h-5 text-[#737685]" />
        <input
          type="text"
          placeholder="Search history records..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm border-none outline-none focus:ring-0 text-[#051a3e]"
        />
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#c3c6d6] rounded-xl p-12 text-center shadow-xs">
          <Languages className="w-12 h-12 text-primary/30 mx-auto mb-3" />
          <p className="text-base font-semibold text-[#051a3e]">No history records found</p>
          <p className="text-sm text-[#737685] mt-1">
            {search ? "No results match your search query." : "Your recent translations will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#c3c6d6] hover:border-primary rounded-xl p-5 shadow-xs transition-all duration-200 group flex justify-between items-start gap-4 relative"
            >
              <div 
                onClick={() => onSelect(item)}
                className="flex-1 cursor-pointer min-w-0"
              >
                {/* Language header */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#434654] mb-2">
                  <span>{item.sourceLang === "Detect language" && item.detectedLanguage ? `${item.detectedLanguage} (Detected)` : item.sourceLang}</span>
                  <span>→</span>
                  <span className="text-[#003d9b]">{item.targetLang}</span>
                  <span className="text-[#737685] font-normal ml-2">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Source & Translated Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#051a3e] line-clamp-2 pr-4">{item.inputText}</p>
                  </div>
                  <div className="min-w-0 border-t md:border-t-0 md:border-l border-[#c3c6d6] pt-2 md:pt-0 md:pl-4">
                    <p className="text-sm font-semibold text-[#003d9b] line-clamp-2">{item.translatedText}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => onToggleSave(item.id)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    item.isSaved
                      ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                      : "text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b]"
                  }`}
                  title={item.isSaved ? "Remove from Saved" : "Save to Phrasebook"}
                >
                  <Star className="w-4 h-4" fill={item.isSaved ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-[#737685] hover:bg-red-50 hover:text-red-600 rounded-full transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSelect(item)}
                  className="p-2 text-primary hover:bg-[#e9edff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex cursor-pointer"
                  title="Load translation"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
