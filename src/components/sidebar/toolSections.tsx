import { Database, Play, GitBranch } from "lucide-react";
import type { ToolSection } from "./framework";
import { FileUploadZone } from "./features/FileUploadZone";
import { ExtractPdfTextAction } from "./features/ExtractPdfTextAction";

export const toolSections: ToolSection[] = [
  {
    title: "Assets",
    defaultOpen: true,
    items: [
      {
        type: "component",
        component: FileUploadZone,
      },
      {
        type: "tool",
        data: {
          icon: <Database className="w-4 h-4 text-blue-600" />,
          label: "Asset",
          description: "Data source or file input",
          nodeType: "asset",
        },
      },
    ],
  },
  {
    title: "Actions",
    defaultOpen: true,
    items: [
      {
        type: "component",
        component: ExtractPdfTextAction,
      },
      {
        type: "tool",
        data: {
          icon: <Play className="w-4 h-4 text-green-600" />,
          label: "Action",
          description: "Process or transform data",
          nodeType: "action",
        },
      },
    ],
  },
  {
    title: "Logic",
    defaultOpen: true,
    items: [
      {
        type: "tool",
        data: {
          icon: <GitBranch className="w-4 h-4 text-amber-600" />,
          label: "Condition",
          description: "Branch based on conditions",
          nodeType: "condition",
        },
      },
    ],
  },
];
