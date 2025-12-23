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
      }
    ],
  },
  {
    title: "Actions",
    defaultOpen: true,
    items: [
      {
        type: "component",
        component: ExtractPdfTextAction,
      }]
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
