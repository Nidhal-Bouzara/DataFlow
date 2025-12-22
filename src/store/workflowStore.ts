import { create } from "zustand";
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "@xyflow/react";
import { generateUniqueId, findNonOverlappingPosition, resolveNodeCollisions } from "@/lib/utils";

// Generic node types for extensible workflow editor
export type NodeType = "asset" | "assetStack" | "action" | "condition";

export interface FileAsset {
  name: string;
  size: number;
  type: string;
}

export interface WorkflowNode extends Node {
  data: {
    label: string;
    description?: string;
    nodeType: NodeType;
    config?: Record<string, unknown>;
    file?: FileAsset;
    files?: FileAsset[]; // For stacked assets
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
  reconnectEdge: (oldEdge: Edge, newConnection: Connection) => void;
  addNode: (nodeType: NodeType, position: { x: number; y: number }) => void;
  addFileAssetNode: (file: FileAsset, position: { x: number; y: number }) => void;
  addStackedFileAssetNode: (files: FileAsset[], position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  setIsRunning: (isRunning: boolean) => void;
  runWorkflow: () => void;
}

// Node type definitions with default properties
export const nodeDefaults: Record<NodeType, { label: string; description: string; bgColor: string; borderColor: string; badgeLabel: string; badgeColor: string }> = {
  asset: {
    label: "Data Source",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Trigger",
    badgeColor: "bg-green-100 text-green-600",
  },
  assetStack: {
    label: "Asset Stack",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Assets",
    badgeColor: "bg-blue-100 text-blue-600",
  },
  action: {
    label: "Send email",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Action",
    badgeColor: "bg-red-100 text-red-500",
  },
  condition: {
    label: "Check condition",
    description: "",
    bgColor: "bg-white",
    borderColor: "border-gray-200",
    badgeLabel: "Check if/else",
    badgeColor: "bg-orange-100 text-orange-500",
  },
};

// Start with empty canvas - ready for user to build workflows
const initialNodes: WorkflowNode[] = [];
const initialEdges: Edge[] = [];

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

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
      edges: addEdge({ ...connection, type: "dataFlow" }, get().edges),
    });
  },

  reconnectEdge: (oldEdge, newConnection) => {
    set({
      edges: get().edges.map((edge) => (edge.id === oldEdge.id ? { ...edge, source: newConnection.source!, target: newConnection.target! } : edge)),
    });
  },

  addNode: (nodeType, position) => {
    const defaults = nodeDefaults[nodeType];
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, { width: 300, height: 150 });

    const newNode: WorkflowNode = {
      id: generateUniqueId(nodeType),
      type: nodeType,
      position: nonOverlappingPosition,
      dragHandle: ".drag-handle",
      data: {
        label: defaults.label,
        description: defaults.description,
        nodeType,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addFileAssetNode: (file, position) => {
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, { width: 300, height: 150 });

    const newNode: WorkflowNode = {
      id: generateUniqueId("asset"),
      type: "asset",
      position: nonOverlappingPosition,
      dragHandle: ".drag-handle",
      data: {
        label: file.name,
        description: formatFileSize(file.size),
        nodeType: "asset",
        file,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addStackedFileAssetNode: (files, position) => {
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, { width: 300, height: 150 });

    const newNode: WorkflowNode = {
      id: generateUniqueId("assetStack"),
      type: "assetStack",
      position: nonOverlappingPosition,
      dragHandle: ".drag-handle",
      data: {
        label: `${files.length} files`,
        description: formatFileSize(totalSize),
        nodeType: "assetStack",
        files,
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
