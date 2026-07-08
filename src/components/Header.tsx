import React from "react";
import { Menu, Settings, User, Languages } from "lucide-react";

interface HeaderProps {
  currentMode: string;
  setCurrentMode: (mode: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
}

export default function Header({
  currentMode,
  setCurrentMode,
  activeTab,
  setActiveTab,
  onOpenSettings
}: HeaderProps) {
  const modes = [
    { id: "text", label: "Text" },
    { id: "documents", label: "Documents" },
    { id: "websites", label: "Websites" }
  ];

  return (
    <header className="bg-white border-b border-[#c3c6d6] h-16 w-full z-10 shrink-0">
      <div className="flex justify-between items-center h-16 px-6 w-full max-w-7xl mx-auto">
        {/* Mobile Header Logo & Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <button 
            onClick={() => {
              // Toggling sidebar on mobile can simply trigger back to main panels
              setActiveTab("translate");
            }}
            className="p-1 rounded-lg hover:bg-[#f1f3ff] text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab("translate")}>
            <Languages className="w-5 h-5 text-[#003d9b]" />
            <span className="font-extrabold text-lg text-[#003d9b] tracking-tight">LinguistPro</span>
          </div>
        </div>

        {/* Main Mode Selectors (Visible only when Translate tab is active) */}
        <div className="hidden lg:flex items-center gap-10 h-full">
          {activeTab === "translate" ? (
            modes.map((mode) => {
              const isActive = currentMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setCurrentMode(mode.id)}
                  className={`flex items-center h-full text-sm font-semibold transition-all relative px-1 cursor-pointer ${
                    isActive
                      ? "text-[#003d9b]"
                      : "text-[#535f73] hover:text-[#003d9b]"
                  }`}
                >
                  <span>{mode.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003d9b] rounded-t-full" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="flex items-center h-full">
              <span className="text-sm font-semibold text-[#003d9b] uppercase tracking-wider">
                {activeTab} PANEL
              </span>
            </div>
          )}
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSettings}
            className="p-2 text-[#434654] hover:bg-[#f1f3ff] hover:text-primary rounded-full transition-colors cursor-pointer"
            title="Application Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab("translate")}
            className="p-2 text-[#434654] hover:bg-[#f1f3ff] hover:text-primary rounded-full transition-colors cursor-pointer"
            title="User Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
