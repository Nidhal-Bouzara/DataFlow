"use client";

import { cn } from "@/lib/utils";
import { Home, Workflow, Database, Settings, HelpCircle } from "lucide-react";
import { AppLogo } from "@/components/icons/BrandIcons";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", isActive: true },
  { icon: <Workflow className="w-5 h-5" />, label: "Workflows" },
  { icon: <Database className="w-5 h-5" />, label: "Assets" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

export function LeftSidebar() {
  return (
    <aside className="w-16 bg-neutral-900 flex flex-col items-center py-4 gap-1">
      {/* Logo */}
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4">
        <AppLogo size={24} className="text-neutral-900" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              "hover:bg-neutral-800",
              item.isActive ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
            )}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="flex flex-col items-center gap-1">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors" title="Help">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">U</div>
      </div>
    </aside>
  );
}
