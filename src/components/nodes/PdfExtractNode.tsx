"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { FileText } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";

export function PdfExtractNode({ data, ...props }: NodeProps<WorkflowNode>) {
  const useOcrFallback = data.config?.useOcrFallback ?? true;
  const label = useOcrFallback ? "Extract Text from PDF + OCR" : "Extract Text from PDF";
  const description = useOcrFallback ? "Extract text content from PDF files with OCR fallback" : "Extract text content from PDF files";
  
  return (
    <BaseNode
      {...props}
      data={{ ...data, label, description }}
      icon={<FileText className="w-5 h-5 text-purple-600" />}
      bgColor="bg-white"
      borderColor="border-purple-200"
      badgeLabel={useOcrFallback ? "PDF Extract + OCR" : "PDF Extract"}
      badgeColor="bg-purple-100 text-purple-600"
    />
  );
}
