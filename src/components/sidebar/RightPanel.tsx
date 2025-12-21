"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronRight, ChevronDown, Database, Play, GitBranch, Plus } from "lucide-react";
import { NodeType, useWorkflowStore } from "@/store/workflowStore";

interface ToolItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
  nodeType: NodeType;
}

interface ToolSection {
  title: string;
  items: ToolItem[];
  defaultOpen?: boolean;
}

const toolSections: ToolSection[] = [
  {
    title: "Assets",
    defaultOpen: true,
    items: [
      {
        icon: <Database className="w-4 h-4 text-blue-600" />,
        label: "Asset",
        description: "Data source or file input",
        nodeType: "asset",
      },
    ],
  },
  {
    title: "Actions",
    defaultOpen: true,
    items: [
      {
        icon: <Play className="w-4 h-4 text-green-600" />,
        label: "Action",
        description: "Process or transform data",
        nodeType: "action",
      },
    ],
  },
  {
    title: "Logic",
    defaultOpen: true,
    items: [
      {
        icon: <GitBranch className="w-4 h-4 text-amber-600" />,
        label: "Condition",
        description: "Branch based on conditions",
        nodeType: "condition",
      },
    ],
  },
];

function CollapsibleSection({ section, isOpen, onToggle }: { section: ToolSection; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium text-gray-900">{section.title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && section.items && (
        <div className="pb-2">
          {section.items.map((item, idx) => (
            <ToolItemComponent key={idx} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolItemComponent({ item }: { item: ToolItem }) {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow", item.nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleClick = () => {
    addNode(item.nodeType, { x: 300, y: 300 });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn("flex items-start gap-3 px-4 py-2 hover:bg-gray-50 transition-colors", "cursor-grab active:cursor-grabbing")}
    >
      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{item.label}</p>
        {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>}
      </div>
      <Plus className="w-4 h-4 text-gray-400 mt-0.5" />
    </div>
  );
}

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
