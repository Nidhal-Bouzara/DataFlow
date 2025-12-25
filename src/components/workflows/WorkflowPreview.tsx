"use client";

import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider, Edge, Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/components/nodes";
import DataFlowEdge from "@/components/edges/DataFlowEdge";
import { useMemo } from "react";

// Define edge types locally to avoid circular dependencies or complex imports if not exported centrally
const edgeTypes = {
  dataFlow: DataFlowEdge,
};

interface WorkflowPreviewProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
}

export function WorkflowPreview({ nodes, edges, className }: WorkflowPreviewProps) {
  // Memoize nodes and edges to prevent unnecessary re-renders
  const flowNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        draggable: false,
        connectable: false,
        selectable: false,
      })),
    [nodes]
  );

  const flowEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        animated: false, // Disable animation for static preview to save performance
        focusable: false,
        selectable: false,
      })),
    [edges]
  );

  return (
    <div className={`w-full h-full pointer-events-none ${className}`}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={true}
          proOptions={{ hideAttribution: true }}
          className="bg-slate-50/50"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" className="opacity-50" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
