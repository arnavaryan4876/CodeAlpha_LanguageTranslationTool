import React from "react";
import { Languages, History, Star, BookOpen } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: "translate", label: "Translate", icon: Languages },
    { id: "history", label: "History", icon: History },
    { id: "saved", label: "Saved", icon: Star },
    { id: "phrasebook", label: "Phrasebook", icon: BookOpen }
  ];

  return (
    <aside
      id="side-navbar"
      className="hidden lg:flex flex-col py-6 px-4 gap-2 bg-[#faf9ff] border-r border-[#c3c6d6] h-full w-64 shrink-0 transition-all duration-200 ease-in-out"
    >
      {/* Branding */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-extrabold text-[#003d9b] tracking-tight">LinguistPro</h1>
        <p className="text-xs font-medium text-[#434654]">Professional Edition</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-[#d4e0f8] text-[#003d9b] font-semibold shadow-xs"
                  : "text-[#434654] hover:bg-[#e9edff] hover:text-[#003d9b]"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-[#003d9b]" : "text-[#737685]"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile Card (Bottom) */}
      <div className="mt-auto pt-6 border-t border-[#c3c6d6] flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-full bg-[#e1e8ff] overflow-hidden border border-[#c3c6d6] shrink-0">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_ibGO8Cx38HHPYFiCfWyPSf2YWkEMUhf2pcOZ32fDsoUKJYeCH4N1cVE-FuYDUc481OwW4262Wxr6-lqxmvNTdTbaskNuQbkivZhcwvPwp8-X7C049Fu0RKm8lZ4GhRMWF9HvG2vuCLgTtrZpx1oG_K99F4LDnTUxW092KE-m3RDwNr1eQyhUw9QkcF8PZzy-mM_-jNNPyXoNNmJPfH3bdgh4psQcbwm5KQoUASWDvMkNOh-EnitThw"
            alt="Alex Chen Profile Avatar"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-[#051a3e] truncate">Alex Chen</span>
          <span className="text-xs text-[#434654]">Standard Tier</span>
        </div>
      </div>
    </aside>
  );
}
