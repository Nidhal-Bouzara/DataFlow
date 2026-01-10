import { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { ExecutionStatus, EdgeStatus } from "@/lib/workflowTheme";

/**
 * All node types supported by the workflow editor
 */
export type NodeType = "asset" | "assetStack" | "action" | "condition" | "extractText" | "processText" | "artifact";

/**
 * File asset representation for asset nodes
 */
export interface FileAsset {
  name: string;
  size: number;
  type: string; // MIME type, e.g., "application/pdf"

  /**
   * Optional File blob for in-memory storage during workflow execution
   *
   * This allows handlers to access actual file content without server upload.
   * Future implementation will move to server-side storage with URLs.
   */
  blob?: File;
}

/**
 * Extended node type with workflow-specific data
 */
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

/**
 * History state slice for undo/redo functionality
 */
export interface HistoryState {
  past: { nodes: WorkflowNode[]; edges: Edge[] }[];
  future: { nodes: WorkflowNode[]; edges: Edge[] }[];
}

/**
 * Execution state slice for workflow visualization
 */
export interface ExecutionState {
  isRunning: boolean;
  nodeStatus: Record<string, ExecutionStatus>;
  edgeStatus: Record<string, EdgeStatus>;
  nodeWorkflowStates: Record<string, unknown>; // WorkflowNodeState by node ID
}

/**
 * Main workflow store state
 */
export interface WorkflowState extends HistoryState, ExecutionState {
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;

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

  // Runner API (Execution Control) - UI-only visual status updates
  setNodeVisualRunning: (nodeId: string) => void;
  setNodeVisualCompleted: (nodeId: string) => void;
  setNodeVisualError: (nodeId: string) => void;
  setEdgeVisualRunning: (edgeId: string) => void;
  setEdgeVisualCompleted: (edgeId: string) => void;
  resetExecution: () => void;
  runWorkflow: (errorStrategy?: "halt" | "continue" | "retry", processingMode?: "parallel" | "sequential") => void;

  // History Actions
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
}
