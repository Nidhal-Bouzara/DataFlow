"use client";

import { Type } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export function ProcessTextAction() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow", "processText");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleAddAction = () => {
    addNode(
      "processText",
      { x: 300, y: 300 },
      {
        options: [
          { key: "mergeInputs", enabled: false },
          { key: "cleanUpText", enabled: false },
          { key: "aiProcessing", enabled: false },
        ],
        aiInstructions: "", // Persist AI instructions value
      }
    );
  };

  return (
    <div className="px-4 py-3">
      {/* Action header with icon */}
      <button
        draggable
        onDragStart={handleDragStart}
        onClick={handleAddAction}
        className="cursor-grab active:cursor-grabbing w-full flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors text-left"
      >
        <div className="w-8 h-8 rounded flex items-center justify-center bg-emerald-100 shrink-0">
          <Type className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">Process Text</p>
          <p className="text-xs text-gray-500 mt-0.5">Transform and process text content</p>
        </div>
      </button>
    </div>
  );
}
