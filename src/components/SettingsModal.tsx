import React from "react";
import { X, Sliders, Volume2, ShieldCheck, Languages } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    speechRate: number;
    speechPitch: number;
    defaultTargetLang: string;
    enableGrammarNotes: boolean;
    enableAutoDictionary: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<{
    speechRate: number;
    speechPitch: number;
    defaultTargetLang: string;
    enableGrammarNotes: boolean;
    enableAutoDictionary: boolean;
  }>>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  setSettings
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#c3c6d6] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c3c6d6] flex justify-between items-center bg-[#faf9ff]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-[#051a3e]">Professional Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#737685] hover:bg-[#e9edff] hover:text-[#051a3e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          
          {/* Section: Text to speech */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#737685] tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#737685]" />
              Text-To-Speech Controls
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-sm text-[#051a3e]">Speech Speed</span>
                  <span className="text-xs text-[#434654]">{settings.speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.speechRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, speechRate: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-sm text-[#051a3e]">Speech Pitch</span>
                  <span className="text-xs text-[#434654]">{settings.speechPitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={settings.speechPitch}
                  onChange={(e) => setSettings(prev => ({ ...prev, speechPitch: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: General preferences */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#737685] tracking-wider flex items-center gap-2">
              <Languages className="w-4 h-4 text-[#737685]" />
              Localization & Translation Defaults
            </h4>

            <div>
              <label className="block text-sm font-semibold text-[#051a3e] mb-1">Default Target Language</label>
              <select
                value={settings.defaultTargetLang}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultTargetLang: e.target.value }))}
                className="w-full border border-[#c3c6d6] rounded-lg p-2.5 text-sm bg-white text-[#051a3e] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: AI Analysis Preferences */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#737685] tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#737685]" />
              AI Enrichment Services
            </h4>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableGrammarNotes}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableGrammarNotes: e.target.checked }))}
                  className="w-4.5 h-4.5 text-primary border-gray-300 rounded-xs focus:ring-primary"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#051a3e]">Enable Smart Grammar Correction</span>
                  <span className="text-xs text-[#737685]">Automatically analyzes and details style and syntactic enhancements</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableAutoDictionary}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableAutoDictionary: e.target.checked }))}
                  className="w-4.5 h-4.5 text-primary border-gray-300 rounded-xs focus:ring-primary"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#051a3e]">Enable Auto-Dictionary Extraction</span>
                  <span className="text-xs text-[#737685]">Identifies key vocabularies, showing definitions and synonyms</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-[#c3c6d6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-primary text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-[#0052cc] active:scale-95 transition-all cursor-pointer"
          >
            Apply Settings
          </button>
        </div>

      </div>
    </div>
  );
}
