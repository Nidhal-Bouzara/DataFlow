"use client";

import { FileText } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export function ExtractPdfTextAction() {
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddAction = () => {
    addNode(
      "pdfExtract",
      { x: 300, y: 300 },
      {
        actionType: "extractPdfText",
        useOcrFallback: true, // Default value
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
          <p className="text-sm font-medium text-gray-900">Extract Text from PDF</p>
          <p className="text-xs text-gray-500 mt-0.5">Extract text content from PDF files</p>
        </div>
      </button>
    </div>
  );
}
