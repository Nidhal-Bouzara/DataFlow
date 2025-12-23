"use client";

import { FileText } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export function ExtractTextAction() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddAction = () => {
    addNode(
      "extractText",
      { x: 300, y: 300 },
      {
        options: [
          { key: "fromPdf", enabled: true },
          { key: "useOcr", enabled: true },
        ],
      }
    );
  };

  return (
    <div className="px-4 py-3">
      {/* Action header with icon */}
      <button onClick={handleAddAction} className="cursor-pointer w-full flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors text-left">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-100 shrink-0">
          <FileText className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">Extract Text</p>
          <p className="text-xs text-gray-500 mt-0.5">Extract text content from documents</p>
        </div>
      </button>
    </div>
  );
}
