import { GitBranch } from "lucide-react";
import type { ToolSection } from "./framework";
import { FileUploadZone } from "./features/FileUploadZone";
import { ExtractTextAction } from "./features/ExtractTextAction";
import { ProcessTextAction } from "./features/ProcessTextAction";
import { ArtifactAction } from "./features/ArtifactAction";

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
        type: "component",
        component: ArtifactAction,
      },
    ],
  },
  {
    title: "Actions",
    defaultOpen: true,
    items: [
      {
        type: "component",
        component: ExtractTextAction,
      },
      {
        type: "component",
        component: ProcessTextAction,
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
