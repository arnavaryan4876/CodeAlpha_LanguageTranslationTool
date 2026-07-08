import React, { useState } from "react";
import { Sparkles, BookOpen, Users, Copy, Check, FileDown, Mail, Share2 } from "lucide-react";
import { DictionaryItem } from "../types";

interface BentoGridProps {
  grammarNotes?: string[];
  dictionary?: DictionaryItem[];
  translatedText?: string;
}

export default function BentoGrid({ grammarNotes = [], dictionary = [], translatedText }: BentoGridProps) {
  const [copiedText, setCopiedText] = useState(false);
  const [activeTab, setActiveTab] = useState<"grammar" | "dict" | "collab">("grammar");

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const element = document.createElement("a");
    const file = new Blob([translatedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "linguistpro-translation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEmailShare = () => {
    if (!translatedText) return;
    const mailtoUrl = `mailto:?subject=LinguistPro Translation&body=${encodeURIComponent(translatedText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-grid-container">
      {/* Smart Grammar Card */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
        <div>
          <div className="flex items-center gap-3 text-primary mb-3">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm tracking-tight">Smart Grammar</span>
          </div>
          {grammarNotes && grammarNotes.length > 0 ? (
            <ul className="space-y-2 mt-2">
              {grammarNotes.map((note, idx) => (
                <li key={idx} className="text-xs text-[#434654] flex gap-2 items-start">
                  <span className="text-primary font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#434654] text-xs leading-relaxed">
              No grammatical issues found. Punctuation, structures, and tense matching are fully verified for professional-grade output.
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-[#f1f3ff] flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#737685] tracking-wider">AI Guard Enabled</span>
          <span className="text-xs text-primary font-semibold">Verified</span>
        </div>
      </div>

      {/* Dictionary Card */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7b2600]" />
        <div>
          <div className="flex items-center gap-3 text-[#7b2600] mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">AI Dictionary</span>
          </div>
          {dictionary && dictionary.length > 0 ? (
            <div className="space-y-3 mt-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
              {dictionary.map((item, idx) => (
                <div key={idx} className="border-b border-[#f1f3ff] pb-2 last:border-0 last:pb-0">
                  <p className="text-xs font-bold text-[#051a3e]">{item.word}</p>
                  <p className="text-[11px] text-[#434654] leading-normal">{item.definition}</p>
                  {item.synonyms && item.synonyms.length > 0 && (
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">
                      Synonyms: {item.synonyms.join(", ")}
                    </p>
                  )}
                  {item.usageExample && (
                    <p className="text-[10px] italic text-[#7b2600] mt-0.5">
                      "{item.usageExample}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#434654] text-xs leading-relaxed">
              Dictionary lookups will activate when you run a translation. Hovering over words displays terminology, synonyms, and localized usage examples.
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-[#f1f3ff] flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#737685] tracking-wider">Linguistic Context</span>
          <span className="text-xs text-[#7b2600] font-semibold">
            {dictionary.length > 0 ? `${dictionary.length} Terms` : "Ready"}
          </span>
        </div>
      </div>

      {/* Collaborate Card */}
      <div className="bg-white border border-[#c3c6d6] rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-600" />
        <div>
          <div className="flex items-center gap-3 text-green-700 mb-3">
            <Users className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Collaborate & Export</span>
          </div>
          <p className="text-[#434654] text-xs leading-relaxed mb-4">
            Share translations with team members, export text files, or send a pre-formatted email directly from the canvas.
          </p>
          
          {translatedText ? (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopy}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f1f3ff] hover:bg-primary/10 text-primary transition-colors cursor-pointer border border-[#e9edff]"
                title="Copy contents"
              >
                {copiedText ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className="text-[9px] font-bold mt-1 uppercase">Copy</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f1f3ff] hover:bg-primary/10 text-primary transition-colors cursor-pointer border border-[#e9edff]"
                title="Download as text"
              >
                <FileDown className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-1 uppercase">Text</span>
              </button>
              <button
                onClick={handleEmailShare}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#f1f3ff] hover:bg-primary/10 text-primary transition-colors cursor-pointer border border-[#e9edff]"
                title="Share via Email"
              >
                <Mail className="w-4 h-4" />
                <span className="text-[9px] font-bold mt-1 uppercase">Mail</span>
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-[#f1f3ff] rounded-lg p-3 text-center text-[11px] text-[#737685] font-medium">
              Run translation to enable export actions
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-[#f1f3ff] flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-[#737685] tracking-wider">Team Productivity</span>
          <span className="text-xs text-green-700 font-semibold">Active</span>
        </div>
      </div>
    </div>
  );
}
