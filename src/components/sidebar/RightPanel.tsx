"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CollapsibleSection } from "./CollapsibleSection";
import { FileUploadZone } from "./FileUploadZone";
import { toolSections } from "./toolSections";

export function RightPanel() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Assets: true,
    Actions: true,
    Logic: true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Section Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add Nodes</h2>
      </div>

      {/* Tool Sections */}
      <div className="flex-1 overflow-y-auto">
        {toolSections.map((section) => (
          <CollapsibleSection
            key={section.title}
            section={section}
            isOpen={openSections[section.title] ?? section.defaultOpen ?? false}
            onToggle={() => toggleSection(section.title)}
            extraContent={section.title === "Assets" ? <FileUploadZone /> : undefined}
          />
        ))}
      </div>

      {/* Empty state hint */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">Drag nodes to the canvas or click to add</p>
      </div>
    </aside>
  );
}
