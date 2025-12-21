import { ChevronRight, ChevronDown } from "lucide-react";
import { NodeType } from "@/store/workflowStore";
import { ToolItemComponent } from "./ToolItemComponent";

export interface ToolItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
  nodeType: NodeType;
}

export interface ToolSection {
  title: string;
  items: ToolItem[];
  defaultOpen?: boolean;
}

interface CollapsibleSectionProps {
  section: ToolSection;
  isOpen: boolean;
  onToggle: () => void;
  extraContent?: React.ReactNode;
}

export function CollapsibleSection({ section, isOpen, onToggle, extraContent }: CollapsibleSectionProps) {
  return (
    <div className="border-b border-gray-100">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <span className="text-sm font-medium text-gray-900">{section.title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && (
        <>
          {extraContent}
          {section.items && (
            <div className="pb-2">
              {section.items.map((item, idx) => (
                <ToolItemComponent key={idx} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
