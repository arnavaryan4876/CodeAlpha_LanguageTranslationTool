import React, { useState } from "react";
import { BookOpen, Search, Copy, Check, ArrowRight, CornerDownLeft } from "lucide-react";
import { DEFAULT_PHRASEBOOK } from "../data";
import { PhrasebookItem } from "../types";

interface PhrasebookPanelProps {
  onSelectPhrase: (english: string, translation: string, targetLang: string) => void;
}

export default function PhrasebookPanel({ onSelectPhrase }: PhrasebookPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Greetings", "Business", "Travel", "Technology"];

  const filtered = DEFAULT_PHRASEBOOK.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.english.toLowerCase().includes(search.toLowerCase()) ||
      item.translation.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6" id="phrasebook-panel-container">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#051a3e] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Interactive Phrasebook
        </h2>
        <p className="text-sm text-[#434654]">
          Explore a pre-curated collection of professional and conversational multi-language phrase templates
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-[#c3c6d6] text-[#434654] hover:bg-[#f1f3ff]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-3 flex items-center gap-3 mb-6 shadow-xs">
        <Search className="w-5 h-5 text-[#737685]" />
        <input
          type="text"
          placeholder="Search phrasebook..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm border-none outline-none focus:ring-0 text-[#051a3e]"
        />
      </div>

      {/* Grid of Phrases */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#c3c6d6] rounded-xl p-12 text-center shadow-xs">
          <BookOpen className="w-12 h-12 text-[#737685]/20 mx-auto mb-3" />
          <p className="text-base font-semibold text-[#051a3e]">No phrases found</p>
          <p className="text-sm text-[#737685] mt-1">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#c3c6d6] hover:border-primary rounded-xl p-5 shadow-xs transition-all duration-200 group flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div 
                onClick={() => onSelectPhrase(item.english, item.translation, item.targetLang)}
                className="flex-1 cursor-pointer min-w-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#e9edff] text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-xs text-[#737685]">to {item.targetLang}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <p className="text-sm font-medium text-[#051a3e]">{item.english}</p>
                  <p className="text-sm font-semibold text-[#003d9b] border-t md:border-t-0 md:border-l border-[#c3c6d6] pt-2 md:pt-0 md:pl-4">
                    {item.translation}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => handleCopy(item.id, item.translation)}
                  className="p-2 text-[#737685] hover:bg-[#f1f3ff] hover:text-[#003d9b] rounded-full transition-colors relative cursor-pointer"
                  title="Copy Translation"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onSelectPhrase(item.english, item.translation, item.targetLang)}
                  className="p-2 text-primary hover:bg-[#e9edff] rounded-full transition-colors flex cursor-pointer"
                  title="Open in translator"
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
