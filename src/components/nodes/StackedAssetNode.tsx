"use client";

import { Handle, Position, NodeProps, useStore } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Plus, Database, GripVertical } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";
import { useMemo, useState } from "react";

export function StackedAssetNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const files = data.files || [];
  const fileCount = files.length;

  const [showTopConnector, setShowTopConnector] = useState(false);
  const [showBottomConnector, setShowBottomConnector] = useState(false);

  // Check if this node has incoming/outgoing edges
  const edges = useStore((state) => state.edges);
  const hasIncomingEdge = useMemo(() => edges.some((edge) => edge.target === id), [edges, id]);
  const hasOutgoingEdge = useMemo(() => edges.some((edge) => edge.source === id), [edges, id]);

  return (
    <div className="relative flex flex-col items-center group">
      {/* Input Handle with + Button (Top) - Only show on hover or when connected */}
      <div
        className={cn("relative flex flex-col items-center transition-opacity duration-200", !hasIncomingEdge && !showTopConnector && "opacity-0 group-hover:opacity-100")}
        onMouseEnter={() => setShowTopConnector(true)}
        onMouseLeave={() => setShowTopConnector(false)}
      >
        <Handle type="target" position={Position.Top} className="w-3! h-3! bg-gray-400! border-2! border-white! -top-6!" />
        {hasIncomingEdge && <div className="w-px h-4 bg-gray-300" />}
        {!hasIncomingEdge && (
          <button
            className={cn(
              "w-6 h-6 rounded-full -mb-1",
              "bg-orange-100 border-2 border-orange-400",
              "flex items-center justify-center",
              "hover:bg-orange-200 transition-colors",
              "cursor-pointer"
            )}
          >
            <Plus className="w-3.5 h-3.5 text-orange-500" />
          </button>
        )}
      </div>

      {/* Main Node Card with Badge Clipped to Top */}
      <div className="relative">
        {/* Floating Type Badge - Positioned to clip onto card */}
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 z-20",
            "px-3 py-1 rounded-full text-xs font-medium",
            "flex items-center gap-1 shadow-sm",
            "bg-blue-100 text-blue-600"
          )}
        >
          <span className="text-[10px]">●</span>
          Assets
        </div>

        <div
          className={cn(
            "relative rounded-xl border shadow-sm transition-all duration-200",
            "min-w-70 px-4 py-3",
            "bg-white border-gray-200",
            selected && "ring-2 ring-blue-500 ring-offset-2"
          )}
        >
          {/* File count badge */}
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm z-20">{fileCount}</div>

          {/* Content */}
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div className="drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>

            {/* Label and Files */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{data.label}</p>
              {files.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                  {files.slice(0, 2).map((file, idx) => (
                    <span key={idx} className="truncate max-w-20">
                      {file.name}
                      {idx < Math.min(files.length - 1, 1) && ","}
                    </span>
                  ))}
                  {files.length > 2 && <span>+{files.length - 2} more</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Output Handle with + Button (Bottom) - Only show on hover or when connected */}
      <div
        className={cn("relative flex flex-col items-center transition-opacity duration-200", !hasOutgoingEdge && !showBottomConnector && "opacity-0 group-hover:opacity-100")}
        onMouseEnter={() => setShowBottomConnector(true)}
        onMouseLeave={() => setShowBottomConnector(false)}
      >
        {hasOutgoingEdge && <div className="w-px h-4 bg-gray-300" />}
        {!hasOutgoingEdge && (
          <button
            className={cn(
              "w-6 h-6 rounded-full -mt-1",
              "bg-orange-100 border-2 border-orange-400",
              "flex items-center justify-center",
              "hover:bg-orange-200 transition-colors",
              "cursor-pointer"
            )}
          >
            <Plus className="w-3.5 h-3.5 text-orange-500" />
          </button>
        )}
        <Handle type="source" position={Position.Bottom} className="w-3! h-3! bg-gray-400! border-2! border-white! -bottom-6!" />
      </div>
    </div>
  );
}
