"use client";

import React from "react";
import {
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from "@xyflow/react";

export default function DataFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        {/* Main gradient for the edge */}
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#6ee7b7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.3" />
        </linearGradient>

        {/* Glow filter for the organic effect */}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated dash pattern for flow effect */}
        <linearGradient id={`flow-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.8">
            <animate
              attributeName="stop-opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.6">
            <animate
              attributeName="stop-opacity"
              values="0.6;1;0.6"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" stopColor="#059669" stopOpacity="0.4">
            <animate
              attributeName="stop-opacity"
              values="0.2;0.6;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>

      {/* Outer glow layer - widest, most transparent */}
      <path
        id={id}
        d={edgePath}
        className="react-flow__edge-path"
        style={{
          ...style,
          stroke: `url(#gradient-${id})`,
          strokeWidth: 12,
          opacity: 0.15,
          filter: `url(#glow-${id})`,
        }}
        fill="none"
      />

      {/* Middle layer - creates the tube effect */}
      <path
        d={edgePath}
        style={{
          stroke: `url(#gradient-${id})`,
          strokeWidth: 8,
          opacity: 0.35,
        }}
        fill="none"
      />

      {/* Inner layer - solid base */}
      <path
        d={edgePath}
        style={{
          stroke: `url(#gradient-${id})`,
          strokeWidth: 4,
          opacity: 0.6,
        }}
        fill="none"
      />

      {/* Animated flow particles */}
      <path
        d={edgePath}
        className="data-flow-animation"
        style={{
          stroke: `url(#flow-gradient-${id})`,
          strokeWidth: 3,
          strokeDasharray: "8 12",
          opacity: 0.9,
        }}
        fill="none"
      />

      {/* Hitbox for interaction */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 20,
          opacity: 0,
        }}
      />
    </>
  );
}
