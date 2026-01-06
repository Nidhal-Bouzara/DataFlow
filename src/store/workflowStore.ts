import { create } from "zustand";
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "@xyflow/react";
import { generateUniqueId, findNonOverlappingPosition } from "@/lib/utils";
import { WORKFLOW_THEME, ExecutionStatus, EdgeStatus } from "@/lib/workflowTheme";
import { initialNodes as preloadedNodes, initialEdges as preloadedEdges } from "@/data/initialWorkflow";

// Generic node types for extensible workflow editor
export type NodeType = "asset" | "assetStack" | "action" | "condition" | "extractText" | "processText" | "artifact";

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

  // History
  past: { nodes: WorkflowNode[]; edges: Edge[] }[];
  future: { nodes: WorkflowNode[]; edges: Edge[] }[];

  // Execution Visualization State
  nodeStatus: Record<string, ExecutionStatus>;
  edgeStatus: Record<string, EdgeStatus>;

  // Actions
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  reconnectEdge: (oldEdge: Edge, newConnection: Connection) => void;
  addNode: (nodeType: NodeType, position: { x: number; y: number }, config?: Record<string, unknown>) => void;
  addFileAssetNode: (file: FileAsset, position: { x: number; y: number }) => void;
  addStackedFileAssetNode: (files: FileAsset[], position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  removeFileFromNode: (nodeId: string, fileName: string) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  setIsRunning: (isRunning: boolean) => void;

  // Runner API (Execution Control)
  startNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;
  failNode: (nodeId: string) => void;
  activateEdge: (edgeId: string) => void;
  completeEdge: (edgeId: string) => void;
  resetExecution: () => void;
  runWorkflow: () => void;

  // History Actions
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
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
  extractText: {
    label: "Extract Text",
    description: "Extract text content from documents",
    bgColor: "bg-white",
    borderColor: "border-purple-200",
    badgeLabel: "Text Extract",
    badgeColor: "bg-purple-100 text-purple-600",
  },
  processText: {
    label: "Process Text",
    description: "Transform and process text content",
    bgColor: "bg-white",
    borderColor: "border-emerald-200",
    badgeLabel: "Text Process",
    badgeColor: "bg-emerald-100 text-emerald-600",
  },
  artifact: {
    label: "Artifact",
    description: "Capture workflow output",
    bgColor: "bg-white",
    borderColor: "border-cyan-200",
    badgeLabel: "Artifact",
    badgeColor: "bg-cyan-100 text-cyan-600",
  },
};

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: preloadedNodes,
  edges: preloadedEdges,
  selectedNodeId: null,
  isRunning: false,
  past: [],
  future: [],

  // Execution Visualization State
  nodeStatus: {},
  edgeStatus: {},

  // History Actions
  takeSnapshot: () => {
    set((state) => ({
      past: [...state.past, { nodes: state.nodes, edges: state.edges }],
      future: [],
    }));
  },

  undo: () => {
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      return {
        nodes: previous.nodes,
        edges: previous.edges,
        past: newPast,
        future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        nodes: next.nodes,
        edges: next.edges,
        past: [...state.past, { nodes: state.nodes, edges: state.edges }],
        future: newFuture,
      };
    });
  },

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
    get().takeSnapshot();
    set({
      edges: addEdge({ ...connection, type: "dataFlow" }, get().edges),
    });
  },

  reconnectEdge: (oldEdge, newConnection) => {
    get().takeSnapshot();
    set({
      edges: get().edges.map((edge) => (edge.id === oldEdge.id ? { ...edge, source: newConnection.source!, target: newConnection.target! } : edge)),
    });
  },

  addNode: (nodeType, position, config) => {
    get().takeSnapshot();
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
        ...(config && { config }),
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addFileAssetNode: (file, position) => {
    get().takeSnapshot();
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
    get().takeSnapshot();
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
    get().takeSnapshot();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  removeFileFromNode: (nodeId, fileName) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node?.data.files) return;

    const updatedFiles = node.data.files.filter((f) => f.name !== fileName);

    if (updatedFiles.length === 0) {
      get().removeNode(nodeId);
      return;
    }

    const totalSize = updatedFiles.reduce((acc, f) => acc + f.size, 0);
    get().updateNodeData(nodeId, {
      files: updatedFiles,
      label: `${updatedFiles.length} file${updatedFiles.length > 1 ? "s" : ""}`,
      description: formatFileSize(totalSize),
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  updateNodeData: (nodeId, data) => {
    get().takeSnapshot();
    set({
      nodes: get().nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
    });
  },

  setIsRunning: (isRunning) => set({ isRunning }),

  // =================================================================
  // RUNNER API IMPLEMENTATION
  // =================================================================

  startNode: (nodeId) =>
    set((state) => ({
      nodeStatus: { ...state.nodeStatus, [nodeId]: "running" },
    })),

  completeNode: (nodeId) =>
    set((state) => ({
      nodeStatus: { ...state.nodeStatus, [nodeId]: "completed" },
    })),

  failNode: (nodeId) =>
    set((state) => ({
      nodeStatus: { ...state.nodeStatus, [nodeId]: "error" },
    })),

  activateEdge: (edgeId) =>
    set((state) => ({
      edgeStatus: { ...state.edgeStatus, [edgeId]: "running" },
    })),

  completeEdge: (edgeId) =>
    set((state) => ({
      edgeStatus: { ...state.edgeStatus, [edgeId]: "completed" },
    })),

  resetExecution: () =>
    set({
      nodeStatus: {},
      edgeStatus: {},
      isRunning: false,
    }),

  runWorkflow: async () => {
    const { nodes, edges, resetExecution, startNode, completeNode, activateEdge, completeEdge } = get();

    // Reset state before starting
    resetExecution();
    set({ isRunning: true });

    // 1. Find starting nodes (nodes with no incoming edges)
    const incomingEdgeCounts = new Map<string, number>();
    nodes.forEach((n) => incomingEdgeCounts.set(n.id, 0));
    edges.forEach((e) => {
      const current = incomingEdgeCounts.get(e.target) || 0;
      incomingEdgeCounts.set(e.target, current + 1);
    });

    // Start with nodes that have 0 incoming edges
    let currentLevelNodes = nodes.filter((n) => (incomingEdgeCounts.get(n.id) || 0) === 0);

    // Fallback for circular/no-start graphs
    if (currentLevelNodes.length === 0 && nodes.length > 0) {
      currentLevelNodes = [nodes[0]];
    }

    // Helper for delay & randomness
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const randomDelay = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

    // Execution constants from Theme (could use store values too)
    const { min, max } = WORKFLOW_THEME.execution.nodeProcessTime;
    const edgeTravelTime = WORKFLOW_THEME.execution.edgeTravelTime;

    // Execution Loop
    console.log("Starting Workflow Execution");

    while (currentLevelNodes.length > 0) {
      const nodeIds = currentLevelNodes.map((n) => n.id);

      // A. START NODES
      console.log("Starting Nodes:", nodeIds);
      nodeIds.forEach((id) => startNode(id));

      // Simulate Processing
      await wait(randomDelay(min, max));

      // B. COMPLETE NODES
      console.log("Completing Nodes:", nodeIds);
      nodeIds.forEach((id) => completeNode(id));

      // Find Next Edges
      const nextEdges = edges.filter((e) => nodeIds.includes(e.source));

      if (nextEdges.length === 0) {
        console.log("No more outgoing edges. Branch ended.");
        break;
      }

      // C. ACTIVATE EDGES (Travel)
      const edgeIds = nextEdges.map((e) => e.id);
      console.log("Activating Edges:", edgeIds);
      edgeIds.forEach((id) => activateEdge(id));

      // Wait for travel
      await wait(edgeTravelTime);

      // D. COMPLETE EDGES (Arrival)
      edgeIds.forEach((id) => completeEdge(id));

      // Prepare next set of nodes
      const nextNodeIds = nextEdges.map((e) => e.target);
      currentLevelNodes = nodes.filter((n) => nextNodeIds.includes(n.id));
    }

    // Finished
    await wait(1000);
    set({ isRunning: false });
  },
}));
