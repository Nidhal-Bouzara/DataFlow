"use client";

import { Handle, Position, NodeProps, useStore } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { WORKFLOW_THEME } from "@/lib/workflowTheme";
import { useMemo, useState } from "react";

interface BaseNodeProps extends NodeProps<WorkflowNode> {
  icon: React.ReactNode;
  bgColor: string;
  borderColor?: string;
  textColor?: string;
  badgeLabel?: string;
  badgeColor?: string;
  glowColor?: string; // Hex color for active glow
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
  glowColor = WORKFLOW_THEME.colors.running,
  children,
}: BaseNodeProps) {
  const [showTopConnector, setShowTopConnector] = useState(false);
  const [showBottomConnector, setShowBottomConnector] = useState(false);

  // Global Workflow State
  const nodeStatus = useWorkflowStore((state) => state.nodeStatus);
  const status = nodeStatus[id] || "idle";
  const isRunning = status === "running";
  const isCompleted = status === "completed";
  const isError = status === "error";

  // Check if this node has incoming/outgoing edges
  const edges = useStore((state) => state.edges);
  const hasIncomingEdge = useMemo(() => edges.some((edge) => edge.target === id), [edges, id]);
  const hasOutgoingEdge = useMemo(() => edges.some((edge) => edge.source === id), [edges, id]);

  // Determine border color based on status
  const getBorderColor = () => {
    if (isError) return WORKFLOW_THEME.colors.error;
    if (isRunning || isCompleted) return glowColor;
    return ""; // Fallback to class
  };

  // Determine shadow based on status
  const getBoxShadow = () => {
    if (isError) return `0 0 0 4px ${WORKFLOW_THEME.colors.error}40`;
    if (isRunning) return `0 0 0 4px ${glowColor}40, 0 10px 25px -5px ${glowColor}50`;
    if (isCompleted) return `0 0 0 2px ${glowColor}, 0 4px 6px -1px ${glowColor}30`;
    if (selected) return "0 0 0 2px #3b82f6, 0 1px 2px 0 rgb(0 0 0 / 0.05)";
    return "0 1px 2px 0 rgb(0 0 0 / 0.05)";
  };

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
        <motion.div
          animate={{
            scale: isRunning ? 1.05 : 1,
            boxShadow: getBoxShadow(),
            borderColor: getBorderColor(),
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative rounded-xl border",
            "min-w-70 px-4 py-3",
            bgColor,
            borderColor,
          )}
        >
          {/* Content */}
          <div className="drag-handle cursor-grab active:cursor-grabbing flex items-center gap-3">
            {/* Floating Type Badge - Positioned to clip onto card */}
            {badgeLabel && (
              <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 z-10", "px-3 py-1 rounded-full text-xs font-medium", "flex items-center gap-1 shadow-sm", "drag-handle cursor-grab active:cursor-grabbing pointer-events-auto", badgeColor)}>
                <span className="text-[10px]">●</span>
                {badgeLabel}
              </div>
            )}
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
            
            {/* Status Indicators */}
            {isRunning && (
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            )}
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            )}
            {isError && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
          </div>

          {/* Custom content area for node-specific controls */}
          {children && <div className="mt-3 pt-3 border-t border-gray-100">{children}</div>}
        </motion.div>
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
