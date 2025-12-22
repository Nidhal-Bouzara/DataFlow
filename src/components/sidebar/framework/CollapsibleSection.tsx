import { ChevronRight, ChevronDown } from "lucide-react";
import type { ToolSection } from "./types";
import { SectionItemRenderer } from "./SectionItemRenderer";

interface CollapsibleSectionProps {
  section: ToolSection;
  isOpen: boolean;
  onToggle: () => void;
}

export function CollapsibleSection({ section, isOpen, onToggle }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-100">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium text-gray-900">{section.title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && section.items && (
        <div className="pb-2">
          {section.items.map((item, idx) => (
            <SectionItemRenderer key={idx} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
