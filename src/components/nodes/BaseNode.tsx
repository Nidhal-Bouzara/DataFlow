"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";

interface BaseNodeProps extends NodeProps<WorkflowNode> {
  icon: React.ReactNode;
  bgColor: string;
  borderColor?: string;
  textColor?: string;
}

export function BaseNode({ data, selected, icon, bgColor, borderColor = "border-gray-200", textColor = "text-gray-900" }: BaseNodeProps) {
  return (
    <div
      className={cn("relative rounded-2xl border-2 shadow-sm transition-all duration-200", "min-w-35 p-4", bgColor, borderColor, selected && "ring-2 ring-blue-500 ring-offset-2")}
    >
      {/* Input Handle */}
      <Handle type="target" position={Position.Left} className="w-3! h-3! bg-gray-300! border-2! border-white!" />

      {/* Content */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center">{icon}</div>
        <div className="text-center">
          <p className={cn("text-sm font-medium", textColor)}>{data.label}</p>
          {data.description && <p className={cn("text-xs opacity-70", textColor)}>{data.description}</p>}
        </div>
      </div>

      {/* Output Handle */}
      <Handle type="source" position={Position.Right} className="w-3! h-3! bg-gray-300! border-2! border-white!" />

      {/* Add button (top-right) */}
      <button
        className={cn(
          "absolute -top-2 -right-2 w-5 h-5 rounded-full",
          "bg-white border border-gray-200 shadow-sm",
          "flex items-center justify-center",
          "opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity",
          "hover:bg-gray-50"
        )}
      >
        <Plus className="w-3 h-3 text-gray-500" />
      </button>
    </div>
  );
}
