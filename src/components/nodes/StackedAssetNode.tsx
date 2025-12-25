"use client";

import { Handle, Position, NodeProps, useStore } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { Database, GripVertical, X, ChevronDown, ChevronUp, File, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { WorkflowNode, useWorkflowStore, FileAsset } from "@/store/workflowStore";
import { WORKFLOW_THEME } from "@/lib/workflowTheme";
import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";

// Helper to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface FileListItemProps {
  file: FileAsset;
  nodeId: string;
  index: number;
}

function FileListItem({ file, nodeId }: FileListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const removeFileFromNode = useWorkflowStore((state) => state.removeFileFromNode);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDeleting(true);
      setCountdown(5);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Delete after 5 seconds
      timerRef.current = setTimeout(() => {
        removeFileFromNode(nodeId, file.name);
      }, 5000);
    },
    [nodeId, file.name, removeFileFromNode]
  );

  const handleUndo = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setIsDeleting(false);
    setCountdown(5);
  }, []);

  const tooltipContent = `${file.name}\n${formatFileSize(file.size)} • ${file.type}`;
  const displayName = file.name.length > 34 ? `${file.name.slice(0, 34)}...` : file.name;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-lg group/item transition-all nodrag",
          isDeleting ? "bg-red-50 border border-red-200" : "bg-gray-50 hover:bg-gray-100"
        )}
      >
        {/* File Icon */}
        <File className="w-3.5 h-3.5 text-blue-500 shrink-0" />

        {/* File Name with Tooltip */}
        <Tooltip content={tooltipContent} side="top">
          <div className="flex-1 min-w-0">
            <p className={cn("text-xs", isDeleting ? "text-red-600 line-through" : "text-gray-900")}>{displayName}</p>
          </div>
        </Tooltip>

        {/* File Size */}
        <span className={cn("text-[10px] shrink-0", isDeleting ? "text-red-500" : "text-gray-500")}>{formatFileSize(file.size)}</span>

        {/* Delete/Undo Button */}
        {isDeleting ? (
          <button onClick={handleUndo} className="px-2 py-0.5 text-[10px] font-medium bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shrink-0">
            Undo ({countdown}s)
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover/item:opacity-100 shrink-0"
            aria-label={`Delete ${file.name}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function StackedAssetNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  const files = data.files || [];
  const fileCount = files.length;

  const [showTopConnector, setShowTopConnector] = useState(false);
  const [showBottomConnector, setShowBottomConnector] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Global Workflow State
  const nodeStatus = useWorkflowStore((state) => state.nodeStatus);
  const status = nodeStatus[id] || "idle";
  const isRunning = status === "running";
  const isCompleted = status === "completed";
  const isError = status === "error";

  const glowColor = WORKFLOW_THEME.colors.assetStack; // Blue

  // Check if this node has incoming/outgoing edges
  const edges = useStore((state) => state.edges);
  const hasIncomingEdge = useMemo(() => edges.some((edge) => edge.target === id), [edges, id]);
  const hasOutgoingEdge = useMemo(() => edges.some((edge) => edge.source === id), [edges, id]);

  // Determine how many files to show
  const maxVisibleFiles = 5;
  const hasMoreFiles = files.length > maxVisibleFiles;
  const visibleFiles = isExpanded ? files : files.slice(0, maxVisibleFiles);

  // Determine border color based on status
  const getBorderColor = () => {
    if (isError) return WORKFLOW_THEME.colors.error;
    if (isRunning || isCompleted) return glowColor;
    return ""; // Fallback
  };

  // Determine shadow based on status
  const getBoxShadow = () => {
    if (isError) return `0 0 0 4px ${WORKFLOW_THEME.colors.error}40`;
    if (isRunning) return `0 0 0 4px ${glowColor}40, 0 10px 25px -5px ${glowColor}50`;
    if (isCompleted) return `0 0 0 2px ${glowColor}, 0 4px 6px -1px ${glowColor}30`;
    if (selected) return "0 0 0 2px #3b82f6, 0 1px 2px 0 rgb(0 0 0 / 0.05)";
    return "";
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
        {/* Floating Type Badge - Positioned to clip onto card */}
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 z-10",
            "px-3 py-1 rounded-full text-xs font-medium",
            "flex items-center gap-1 shadow-sm",
            "bg-blue-100 text-blue-600"
          )}
        >
          <span className="text-[10px]">●</span>
          Assets
        </div>

        <motion.div
          animate={{
            scale: isRunning ? 1.05 : 1,
            boxShadow: getBoxShadow(),
            borderColor: getBorderColor(),
          }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative rounded-xl border",
            "min-w-90 max-w-120 overflow-x-visible",
            "bg-white border-gray-200",
          )}
        >
          {/* File count badge */}
          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-sm z-20">{fileCount}</div>

          {/* Header - Always Draggable */}
          <div className="drag-handle cursor-grab active:cursor-grabbing px-4 py-3 flex items-center gap-3">
            {/* Drag Handle */}
            <div className="text-gray-400 hover:text-gray-600">
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-blue-600" />
            </div>

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{data.label}</p>
              {data.description && <p className="text-xs text-gray-500">{data.description}</p>}
            </div>

            {/* Status Indicators */}
            {isRunning && (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
            )}
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
            )}
            {isError && (
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            )}
          </div>

          {/* File List - Scrollable, Not Draggable */}
          {files.length > 0 && (
            <div className="px-4 pb-3">
              <div className={cn("space-y-1 overflow-y-hidden", isExpanded ? "max-h-60" : "max-h-50")}>
                <AnimatePresence mode="popLayout">
                  {visibleFiles.map((file, index) => (
                    <FileListItem key={file.name} file={file} nodeId={id} index={index} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Expand/Collapse Button */}
              {hasMoreFiles && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="nodrag mt-2 w-full flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Show {files.length - maxVisibleFiles} More
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Output Handle with + Button (Bottom) - Only show on hover or when connected */}
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
