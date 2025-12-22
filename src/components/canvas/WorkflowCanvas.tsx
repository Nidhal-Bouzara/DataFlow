"use client";

import { useCallback, useRef } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore, NodeType } from "@/store/workflowStore";
import { nodeTypes } from "@/components/nodes";
import DataFlowEdge from "@/components/edges/DataFlowEdge";
import { BottomToolbar } from "@/components/toolbar/BottomToolbar";

const edgeTypes = {
  dataFlow: DataFlowEdge,
};

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode } = useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [screenToFlowPosition, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        defaultEdgeOptions={{
          type: "dataFlow",
        }}
        connectionLineStyle={{ stroke: "#6ee7b7", strokeWidth: 3 }}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <Controls className="bg-white! border! border-gray-200! rounded-xl! shadow-sm!" showZoom={false} showFitView={true} showInteractive={false} />
        <MiniMap
          className="bg-white! border! border-gray-200! rounded-xl! shadow-sm!"
          maskColor="rgba(0, 0, 0, 0.1)"
          nodeColor={(node) => {
            switch (node.type) {
              case "asset":
                return "#dbeafe"; // blue-100
              case "action":
                return "#dcfce7"; // green-100
              case "condition":
                return "#fef3c7"; // amber-100
              default:
                return "#f1f5f9"; // slate-100
            }
          }}
        />
      </ReactFlow>
      <BottomToolbar />
    </div>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
}
