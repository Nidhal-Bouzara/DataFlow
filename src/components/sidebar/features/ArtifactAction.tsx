"use client";

import { Package } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export function ArtifactAction() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddAction = () => {
    addNode(
      "artifact",
      { x: 300, y: 300 },
      {
        name: "Unnamed Artifact",
        output: null,
      }
    );
  };

  return (
    <div className="px-4 py-3">
      {/* Action header with icon */}
      <button onClick={handleAddAction} className="cursor-pointer w-full flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors text-left">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-cyan-100 shrink-0">
          <Package className="w-4 h-4 text-cyan-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">Artifact</p>
          <p className="text-xs text-gray-500 mt-0.5">Capture workflow output at any point</p>
        </div>
      </button>
    </div>
  );
}
