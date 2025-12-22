"use client";

import React from "react";
import { EdgeProps, getSmoothStepPath, BaseEdge } from "@xyflow/react";

export default function DataFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  });

  return (
    <>
      {/* Main edge path - simple gray stroke */}
      <path
        id={id}
        d={edgePath}
        className="react-flow__edge-path"
        style={{
          ...style,
          stroke: "#374151",
          strokeWidth: 2,
        }}
        fill="none"
      />

      {/* Hitbox for interaction - invisible wider path */}
      <BaseEdge
        id={`${id}-hitbox`}
        path={edgePath}
        style={{
          strokeWidth: 20,
          stroke: "transparent",
          fill: "none",
        }}
      />
    </>
  );
}
