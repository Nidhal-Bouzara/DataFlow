// Centralized configuration for Workflow Visualization
// Easy to tweak colors, animations, and execution timings here.

export const WORKFLOW_THEME = {
  colors: {
    asset: "#22c55e",      // Green-500
    assetStack: "#3b82f6", // Blue-500
    action: "#ef4444",     // Red-500
    condition: "#f97316",  // Orange-500
    extractText: "#a855f7",// Purple-500
    processText: "#10b981",// Emerald-500
    artifact: "#06b6d4",   // Cyan-500
    default: "#64748b",    // Slate-500
    
    // State colors
    running: "#3b82f6",    // Blue (default running)
    completed: "#10b981",  // Green (success)
    error: "#ef4444",      // Red (error)
  },
  animation: {
    duration: {
      nodePulse: 1.5,
      edgePacket: 1.5,
      nodeEnter: 0.3,
    },
    packetSize: 6, // Radius of the edge packet
  },
  execution: {
    nodeProcessTime: { min: 800, max: 1600 }, // Simulated processing time
    edgeTravelTime: 1000, // Time for packet to travel edge
  }
} as const;

export type NodeType = keyof typeof WORKFLOW_THEME.colors;
export type ExecutionStatus = "idle" | "running" | "completed" | "error";
export type EdgeStatus = "idle" | "running" | "completed";
