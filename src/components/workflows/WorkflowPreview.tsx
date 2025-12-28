"use client";

import { ReactFlow, Background, BackgroundVariant, ReactFlowProvider, Edge, Node, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/components/nodes";
import DataFlowEdge from "@/components/edges/DataFlowEdge";
import { useMemo } from "react";
import { getAutoLayoutedElements } from "@/lib/utils";

// Define edge types locally to avoid circular dependencies or complex imports if not exported centrally
const edgeTypes = {
  dataFlow: DataFlowEdge,
};

interface WorkflowPreviewProps {
  nodes: Node[];
  edges: Edge[];
  className?: string;
  interactive?: boolean;
}

export function WorkflowPreview({ nodes, edges, className, interactive = false }: WorkflowPreviewProps) {
  // Apply auto-layout and memoize
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getAutoLayoutedElements(nodes, edges);
  }, [nodes, edges]);

  // Memoize nodes and edges to prevent unnecessary re-renders
  const flowNodes = useMemo(
    () =>
      layoutedNodes.map((node) => ({
        ...node,
        draggable: false,
        connectable: false,
        selectable: interactive,
      })),
    [layoutedNodes, interactive]
  );

  const flowEdges = useMemo(
    () =>
      layoutedEdges.map((edge) => ({
        ...edge,
        animated: false, // Disable animation for static preview to save performance
        focusable: interactive,
        selectable: interactive,
      })),
    [layoutedEdges, interactive]
  );

  return (
    <div className={`w-full h-full ${!interactive ? "pointer-events-none" : ""} ${className}`}>
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
          elementsSelectable={interactive}
          panOnDrag={interactive}
          zoomOnScroll={interactive}
          zoomOnPinch={interactive}
          zoomOnDoubleClick={interactive}
          preventScrolling={!interactive}
          proOptions={{ hideAttribution: true }}
          className="bg-slate-50/50"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" className="opacity-50" />
          {interactive && <Controls showInteractive={false} />}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
