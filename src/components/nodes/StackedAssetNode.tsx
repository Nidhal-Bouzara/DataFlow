"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Plus, Database } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";

export function StackedAssetNode({ data, selected }: NodeProps<WorkflowNode>) {
  const files = data.files || [];
  const fileCount = files.length;

  // Show up to 3 stacked cards
  const stackCount = Math.min(fileCount, 3);

  return (
    <div className="relative">
      {/* Stacked cards behind - rendered first (back to front) */}
      {Array.from({ length: stackCount - 1 }).map((_, index) => {
        const reverseIndex = stackCount - 2 - index;
        const offset = (reverseIndex + 1) * 6;
        const rotation = (reverseIndex + 1) * 2;

        return (
          <div
            key={reverseIndex}
            className={cn("absolute rounded-2xl border-2 shadow-sm", "min-w-35 p-4 bg-blue-50 border-blue-200")}
            style={{
              transform: `translateY(${offset}px) rotate(${rotation}deg)`,
              zIndex: -reverseIndex - 1,
            }}
          >
            <div className="flex flex-col items-center gap-2 opacity-0">
              <div className="w-10 h-10 flex items-center justify-center">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center w-full px-2">
                <p className="text-sm font-medium text-gray-900 mb-1">{data.label}</p>
                {data.description && <p className="text-xs text-gray-900 opacity-70 mb-2">{data.description}</p>}
                {files.length > 0 && (
                  <div className="space-y-0.5 max-w-[180px]">
                    {files.slice(0, 3).map((file, idx) => (
                      <p key={idx} className="text-xs text-gray-700 truncate">
                        {file.name}
                      </p>
                    ))}
                    {files.length > 3 && <p className="text-xs text-gray-500 italic">+{files.length - 3} more</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Main card (front) */}
      <div
        className={cn(
          "relative rounded-2xl border-2 shadow-sm transition-all duration-200",
          "min-w-35 p-4 bg-blue-50 border-blue-200",
          selected && "ring-2 ring-blue-500 ring-offset-2"
        )}
      >
        {/* Input Handle */}
        <Handle type="target" position={Position.Left} className="w-3! h-3! bg-gray-300! border-2! border-white!" />

        {/* Content */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center w-full px-2">
            <p className="text-sm font-medium text-gray-900 mb-1">{data.label}</p>
            {data.description && <p className="text-xs text-gray-900 opacity-70 mb-2">{data.description}</p>}
            {/* File names list */}
            {files.length > 0 && (
              <div className="space-y-0.5 max-w-[180px]">
                {files.slice(0, 3).map((file, idx) => (
                  <p key={idx} className="text-xs text-gray-700 truncate" title={file.name}>
                    {file.name}
                  </p>
                ))}
                {files.length > 3 && <p className="text-xs text-gray-500 italic">+{files.length - 3} more</p>}
              </div>
            )}
          </div>
        </div>

        {/* Output Handle */}
        <Handle type="source" position={Position.Right} className="w-3! h-3! bg-gray-300! border-2! border-white!" />

        {/* File count badge */}
        <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">{fileCount}</div>

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
    </div>
  );
}
