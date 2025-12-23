"use client";

import { useState } from "react";
import { FileText, HelpCircle } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";
import { Toggle } from "@/components/ui/Toggle";
import { Tooltip } from "@/components/ui/Tooltip";

export function ExtractPdfTextAction() {
  const [useOcrFallback, setUseOcrFallback] = useState(true);
  const addNode = useWorkflowStore((state) => state.addNode);

  const handleAddAction = () => {
    addNode(
      "pdfExtract",
      { x: 300, y: 300 },
      {
        actionType: "extractPdfText",
        useOcrFallback,
      }
    );
  };

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      {/* Action header with icon */}
      <button onClick={handleAddAction} className="w-full flex items-start gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors text-left">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-purple-100 shrink-0">
          <FileText className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">Extract Text from PDF</p>
          <p className="text-xs text-gray-500 mt-0.5">Extract text content from PDF files</p>
        </div>
      </button>

      {/* Toggle option */}
      <div className="mt-3 pl-11 flex items-center gap-2">
        <Toggle id="ocr-fallback" checked={useOcrFallback} onChange={setUseOcrFallback} />
        <label htmlFor="ocr-fallback" className="text-xs text-gray-700 cursor-pointer flex-1">
          Use OCR on basic text extraction failure
        </label>
        <Tooltip
          content="When enabled, OCR (Optical Character Recognition) will automatically be used if standard text extraction fails. This is useful for scanned documents or image-based PDFs."
          side="top"
        >
          <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about OCR fallback">
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
