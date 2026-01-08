import { NodeType } from "../types/workflow";

/**
 * Configuration for a node type's visual appearance and metadata
 */
export interface NodeDefaultConfig {
  label: string;
  description: string;
  bgColor: string;
  borderColor: string;
  badgeLabel: string;
  badgeColor: string;
}

/**
 * Default properties for each node type
 * Used when creating new nodes via drag-and-drop or programmatically
 */
export const nodeDefaults: Record<NodeType, NodeDefaultConfig> = {
  asset: {
    label: "Data Source",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Trigger",
    badgeColor: "bg-green-100 text-green-600",
  },
  assetStack: {
    label: "Asset Stack",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Assets",
    badgeColor: "bg-blue-100 text-blue-600",
  },
  action: {
    label: "Send email",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Action",
    badgeColor: "bg-red-100 text-red-500",
  },
  condition: {
    label: "Check condition",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Check if/else",
    badgeColor: "bg-orange-100 text-orange-500",
  },
  extractText: {
    label: "Extract Text",
    description: "Extract text content from documents",
    bgColor: "bg-white",
    borderColor: "border-purple-200",
    badgeLabel: "Text Extract",
    badgeColor: "bg-purple-100 text-purple-600",
  },
  processText: {
    label: "Process Text",
    description: "Transform and process text content",
    bgColor: "bg-white",
    borderColor: "border-emerald-200",
    badgeLabel: "Text Process",
    badgeColor: "bg-emerald-100 text-emerald-600",
  },
  artifact: {
    label: "Artifact",
    description: "Capture workflow output",
    bgColor: "bg-white",
    borderColor: "border-cyan-200",
    badgeLabel: "Artifact",
    badgeColor: "bg-cyan-100 text-cyan-600",
  },
};
