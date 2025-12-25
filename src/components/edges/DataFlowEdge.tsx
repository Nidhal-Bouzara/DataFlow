"use client";

import React from "react";
import { EdgeProps, getSmoothStepPath, BaseEdge } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { WORKFLOW_THEME } from "@/lib/workflowTheme";

export default function DataFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }: EdgeProps) {
  const edgeStatus = useWorkflowStore((state) => state.edgeStatus);
  const status = edgeStatus[id] || "idle";
  const isRunning = status === "running";
  const isCompleted = status === "completed";

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  const activeColor = WORKFLOW_THEME.colors.running;
  const defaultColor = "#374151"; // Gray-700
  
  // Calculate duration string (e.g., "1s")
  const duration = `${WORKFLOW_THEME.execution.edgeTravelTime / 1000}s`;

  return (
    <>
      {/* Main edge path */}
      <path
        id={id}
        d={edgePath}
        className="react-flow__edge-path"
        style={{
          ...style,
          stroke: isRunning || isCompleted ? activeColor : defaultColor,
          strokeWidth: isRunning ? 3 : 2,
          transition: "stroke 0.3s ease, stroke-width 0.3s ease",
        }}
        fill="none"
      />

      {/* Hitbox for interaction */}
      <BaseEdge
        id={`${id}-hitbox`}
        path={edgePath}
        style={{
          strokeWidth: 20,
          stroke: "transparent",
          fill: "none",
        }}
      />

      {/* Animated Data Packet */}
      {isRunning && (
        <circle r={WORKFLOW_THEME.animation.packetSize} fill="#60a5fa" className="filter drop-shadow-md">
          <animateMotion dur={duration} repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
}
