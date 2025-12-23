"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FileText, HelpCircle } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { Toggle } from "@/components/ui/Toggle";
import { Tooltip } from "@/components/ui/Tooltip";

export function PdfExtractNode({ id, data, ...props }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const useOcrFallback = (data.config?.useOcrFallback as boolean) ?? true;
  
  const handleToggleChange = (checked: boolean) => {
    updateNodeData(id, {
      config: {
        ...data.config,
        useOcrFallback: checked,
      },
    });
  };
  
  const label = useOcrFallback ? "Extract Text from PDF + OCR" : "Extract Text from PDF";
  const description = useOcrFallback ? "Extract text content from PDF files with OCR fallback" : "Extract text content from PDF files";
  
  return (
    <BaseNode
      {...props}
      id={id}
      data={{ ...data, label, description }}
      icon={<FileText className="w-5 h-5 text-purple-600" />}
      bgColor="bg-white"
      borderColor="border-purple-200"
      badgeLabel={useOcrFallback ? "PDF Extract + OCR" : "PDF Extract"}
      badgeColor="bg-purple-100 text-purple-600"
    >
      {/* OCR Toggle Control */}
      <div className="flex items-center gap-2">
        <Toggle
          id={`ocr-fallback-${id}`}
          checked={useOcrFallback}
          onChange={handleToggleChange}
        />
        <label
          htmlFor={`ocr-fallback-${id}`}
          className="text-xs text-gray-700 cursor-pointer flex-1"
        >
          Use OCR on failure
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
    </BaseNode>
  );
}
