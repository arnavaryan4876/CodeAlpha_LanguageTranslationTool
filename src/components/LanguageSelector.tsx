import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { Language } from "../data";

interface LanguageSelectorProps {
  selectedCode: string;
  onChange: (lang: Language) => void;
  languages: Language[];
  excludeAuto?: boolean;
}

export default function LanguageSelector({
  selectedCode,
  onChange,
  languages,
  excludeAuto = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLanguages = languages
    .filter((lang) => {
      if (excludeAuto && lang.code === "auto") return false;
      return lang.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const selectedLanguage = languages.find((lang) => lang.code === selectedCode) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset search query when dropdown closes or opens
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef} id={`lang-selector-${selectedCode}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-primary font-medium px-4 py-2 hover:bg-[#f1f3ff] active:bg-[#e9edff] rounded-lg transition-colors cursor-pointer text-sm"
      >
        {selectedLanguage.name}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-[#DFE1E6] rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-[#DFE1E6] flex items-center gap-2 bg-[#faf9ff]">
            <Search className="w-4 h-4 text-[#737685]" />
            <input
              type="text"
              placeholder="Search language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 p-1 placeholder-[#737685] text-[#051a3e]"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
            {filteredLanguages.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#737685] text-center">
                No languages found
              </div>
            ) : (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[#f1f3ff] ${
                    lang.code === selectedCode
                      ? "text-primary font-semibold bg-[#e9edff]"
                      : "text-[#051a3e]"
                  }`}
                >
                  <span>{lang.name}</span>
                  {lang.code === selectedCode && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
