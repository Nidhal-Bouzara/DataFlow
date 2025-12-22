import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflowStore } from "@/store/workflowStore";
import type { ToolItem } from "./types";

interface ToolItemComponentProps {
  item: ToolItem;
}

export function ToolItemComponent({ item }: ToolItemComponentProps) {
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
