"use client";

import { Handle, Position, NodeProps, useStore } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";
import { useMemo, useState } from "react";

interface BaseNodeProps extends NodeProps<WorkflowNode> {
  icon: React.ReactNode;
  bgColor: string;
  borderColor?: string;
  textColor?: string;
  badgeLabel?: string;
  badgeColor?: string;
  children?: React.ReactNode; // Allow custom content below the node
}

export function BaseNode({
  id,
  data,
  selected,
  icon,
  bgColor,
  borderColor = "border-gray-200",
  textColor = "text-gray-900",
  badgeLabel,
  badgeColor = "bg-green-100 text-green-600",
  children,
}: BaseNodeProps) {
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
        className={cn("relative flex flex-col items-center transition-opacity duration-200 z-20", !hasIncomingEdge && !showTopConnector && "opacity-0 group-hover:opacity-100")}
        onMouseEnter={() => setShowTopConnector(true)}
        onMouseLeave={() => setShowTopConnector(false)}
      >
        <Handle type="target" position={Position.Top} className="w-3! h-3! bg-gray-400! border-2! border-white! -top-3.5!" />
      </div>

      {/* Main Node Card with Badge Clipped to Top */}
      <div className="relative">
        {/* Floating Type Badge - Positioned to clip onto card */}
        {badgeLabel && (
          <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 z-10", "px-3 py-1 rounded-full text-xs font-medium", "flex items-center gap-1 shadow-sm", badgeColor)}>
            <span className="text-[10px]">●</span>
            {badgeLabel}
          </div>
        )}

        <div
          className={cn(
            "relative rounded-xl border shadow-sm transition-all duration-200",
            "min-w-70 px-4 py-3",
            bgColor,
            borderColor,
            selected && "ring-2 ring-blue-500 ring-offset-2"
          )}
        >
          {/* Content */}
          <div className="drag-handle cursor-grab active:cursor-grabbing flex items-center gap-3">
            {/* Drag Handle */}
            <div className="text-gray-400 hover:text-gray-600">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">{icon}</div>

            {/* Label with animated content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={data.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn("text-sm font-medium", textColor)}
                >
                  {data.label}
                </motion.p>
              </AnimatePresence>
              {data.description && (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={data.description}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn("text-xs opacity-60", textColor)}
                  >
                    {data.description}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Custom content area for node-specific controls */}
          {children && <div className="mt-3 pt-3 border-t border-gray-100">{children}</div>}
        </div>
      </div>

      {/* Output Handle - Only show on hover or when connected */}
      <div
        className={cn("relative transition-opacity duration-200", !hasOutgoingEdge && !showBottomConnector && "opacity-0 group-hover:opacity-100")}
        onMouseEnter={() => setShowBottomConnector(true)}
        onMouseLeave={() => setShowBottomConnector(false)}
      >
        <Handle type="source" position={Position.Bottom} className="w-3! h-3! bg-gray-400! border-2! border-white!" />
      </div>
    </div>
  );
}
