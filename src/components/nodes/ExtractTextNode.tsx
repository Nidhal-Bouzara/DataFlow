"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FileText, HelpCircle } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { Toggle } from "@/components/ui/Toggle";
import { Tooltip } from "@/components/ui/Tooltip";

interface ExtractOption {
  key: "fromPdf" | "useOcr";
  enabled: boolean;
}

export function ExtractTextNode({ id, data, ...props }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  
  // Get options from config (array-based)
  const options = (data.config?.options as ExtractOption[]) ?? [
    { key: "fromPdf", enabled: true },
    { key: "useOcr", enabled: true },
  ];
  
  // Helper to find option state
  const getOptionState = (key: ExtractOption["key"]) => {
    return options.find((opt) => opt.key === key)?.enabled ?? false;
  };
  
  // Helper to toggle option
  const handleToggleOption = (key: ExtractOption["key"], checked: boolean) => {
    const newOptions = options.map((opt) => (opt.key === key ? { ...opt, enabled: checked } : opt));
    
    updateNodeData(id, {
      config: {
        ...data.config,
        options: newOptions,
      },
    });
  };
  
  const fromPdf = getOptionState("fromPdf");
  const useOcr = getOptionState("useOcr");
  
  // Dynamic label based on enabled options
  const enabledOptions = options.filter((opt) => opt.enabled);
  const label = enabledOptions.length > 0 ? `Extract Text (${enabledOptions.length})` : "Extract Text";
  const description = "Extract text content from documents";
  
  return (
    <BaseNode
      {...props}
      id={id}
      data={{ ...data, label, description }}
      icon={<FileText className="w-5 h-5 text-purple-600" />}
      bgColor="bg-white"
      borderColor="border-purple-200"
      badgeLabel="Text Extract"
      badgeColor="bg-purple-100 text-purple-600"
      glowColor="#a855f7"
    >
      {/* Extract Options */}
      <div className="space-y-3">
        
        {/* Option 1: From PDF */}
        <div className="flex items-center gap-2">
          <Toggle
            id={`from-pdf-${id}`}
            checked={fromPdf}
            onChange={(checked) => handleToggleOption("fromPdf", checked)}
          />
          <label
            htmlFor={`from-pdf-${id}`}
            className="text-xs text-gray-700 cursor-pointer flex-1"
          >
            From PDF
          </label>
          <Tooltip
            content="Extract text content from PDF files. Supports both text-based and scanned PDFs."
            side="top"
          >
            <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about PDF extraction">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </Tooltip>
        </div>
        
        {/* Option 2: Use OCR */}
        <div className="flex items-center gap-2">
          <Toggle
            id={`use-ocr-${id}`}
            checked={useOcr}
            onChange={(checked) => handleToggleOption("useOcr", checked)}
          />
          <label
            htmlFor={`use-ocr-${id}`}
            className="text-xs text-gray-700 cursor-pointer flex-1"
          >
            Use OCR
          </label>
          <Tooltip
            content="When enabled, OCR (Optical Character Recognition) will be used for scanned documents or image-based PDFs. Automatically falls back when standard text extraction fails."
            side="top"
          >
            <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about OCR">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </Tooltip>
        </div>
        
      </div>
    </BaseNode>
  );
}
