import { create } from "zustand";
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "@xyflow/react";
import { generateUniqueId } from "@/lib/utils";

// Generic node types for extensible workflow editor
export type NodeType = "asset" | "action" | "condition";

export interface WorkflowNode extends Node {
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    config?: Record<string, unknown>;
  };
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  isRunning: boolean;

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  setIsRunning: (isRunning: boolean) => void;
  runWorkflow: () => void;
}

// Node type definitions with default properties
export const nodeDefaults: Record<NodeType, { label: string; description: string; bgColor: string; borderColor: string }> = {
  asset: {
    label: "Asset",
    description: "Data source or file",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  action: {
    label: "Action",
    description: "Process or transform",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  condition: {
    label: "Condition",
    description: "Branch logic",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

// Start with empty canvas - ready for user to build workflows
const initialNodes: WorkflowNode[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  isRunning: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: "smoothstep" }, get().edges),
    });
  },

  addNode: (nodeType, position) => {
    const defaults = nodeDefaults[nodeType];
    const newNode: WorkflowNode = {
      id: generateUniqueId(nodeType),
      type: nodeType,
      position,
      data: {
        label: defaults.label,
        description: defaults.description,
        nodeType,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
    });
  },

  setIsRunning: (isRunning) => set({ isRunning }),

  runWorkflow: () => {
    set({ isRunning: true });
    // Simulate workflow execution
    setTimeout(() => {
      set({ isRunning: false });
    }, 2000);
  },
}));
