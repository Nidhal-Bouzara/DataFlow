"use client";

import { useCallback, useRef } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, useReactFlow, ConnectionMode, Edge, Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore, NodeType } from "@/store/workflowStore";
import { nodeTypes } from "@/components/nodes";
import DataFlowEdge from "@/components/edges/DataFlowEdge";
import { BottomToolbar } from "@/components/toolbar/BottomToolbar";
import { resolveNodeCollisions } from "@/lib/utils";

const edgeTypes = {
  dataFlow: DataFlowEdge,
};

function WorkflowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, selectNode, reconnectEdge, setNodes } = useWorkflowStore();

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

  const handleReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      reconnectEdge(oldEdge, newConnection);
    },
    [reconnectEdge]
  );

  const handleNodeDragStop = useCallback(() => {
    const resolvedNodes = resolveNodeCollisions(nodes, { margin: 20, maxIterations: 10 });
    setNodes(resolvedNodes);
  }, [nodes, setNodes]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={handleReconnect}
        onNodeDragStop={handleNodeDragStop}
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
        connectionMode={ConnectionMode.Loose}
        connectionLineStyle={{ stroke: "#f97316", strokeWidth: 2, strokeDasharray: "5,5" }}
        edgesReconnectable={true}
        reconnectRadius={30}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50"
        nodeDragThreshold={1}
        nodesDraggable={true}
        selectNodesOnDrag={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <Controls className="bg-white! border! border-gray-200! rounded-xl! shadow-sm!" showZoom={false} showFitView={true} showInteractive={false} />
        <MiniMap className="bg-white! border! border-gray-200! rounded-xl! shadow-sm!" maskColor="rgba(0, 0, 0, 0.1)" nodeColor={() => "#f8fafc"} />
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
