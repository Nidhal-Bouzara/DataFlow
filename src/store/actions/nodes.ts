import { NodeChange, applyNodeChanges, Edge } from "@xyflow/react";
import { WorkflowNode, NodeType, FileAsset } from "../types/workflow";
import { nodeDefaults } from "../constants/nodeDefaults";
import { formatFileSize } from "../utils/helpers";
import { generateUniqueId, findNonOverlappingPosition } from "@/lib/utils";

/**
 * State getter interface for node operations
 */
type NodeStateGetter = () => { nodes: WorkflowNode[]; edges: Edge[] };

/**
 * State setter interface for node operations
 */
type NodeStateSetter = (partial: {
  nodes?: WorkflowNode[];
  edges?: Edge[];
  selectedNodeId?: string | null;
}) => void;

/**
 * Context provided to node action creators
 */
interface NodeActionsContext {
  get: NodeStateGetter;
  set: NodeStateSetter;
  takeSnapshot: () => void;
}

/**
 * Creates node management actions
 *
 * @param context - Zustand get/set functions and history snapshot
 * @returns Object with node action methods
 */
export const createNodeActions = ({ get, set, takeSnapshot }: NodeActionsContext) => ({
  /**
   * Replaces all nodes with a new array
   *
   * @param nodes - New nodes array
   */
  setNodes: (nodes: WorkflowNode[]) => set({ nodes }),

  /**
   * Applies React Flow node changes (position, selection, removal, etc.)
   *
   * @param changes - Array of node changes from React Flow
   */
  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] });
  },

  /**
   * Adds a new node to the workflow
   * Automatically finds a non-overlapping position and assigns a unique ID
   *
   * @param nodeType - Type of node to create
   * @param position - Desired canvas position (will be adjusted if overlapping)
   * @param config - Optional configuration data for the node
   */
  addNode: (nodeType: NodeType, position: { x: number; y: number }, config?: Record<string, unknown>) => {
    takeSnapshot();
    const defaults = nodeDefaults[nodeType];
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, {
      width: 300,
      height: 150,
    });

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

  /**
   * Adds a single file as an asset node
   *
   * @param file - File asset metadata
   * @param position - Desired canvas position (will be adjusted if overlapping)
   */
  addFileAssetNode: (file: FileAsset, position: { x: number; y: number }) => {
    takeSnapshot();
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, {
      width: 300,
      height: 150,
    });

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

  /**
   * Adds multiple files as a stacked asset node
   *
   * @param files - Array of file assets
   * @param position - Desired canvas position (will be adjusted if overlapping)
   */
  addStackedFileAssetNode: (files: FileAsset[], position: { x: number; y: number }) => {
    takeSnapshot();
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const nonOverlappingPosition = findNonOverlappingPosition(get().nodes, position, {
      width: 300,
      height: 150,
    });

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

  /**
   * Removes a node and all connected edges
   *
   * @param nodeId - ID of the node to remove
   */
  removeNode: (nodeId: string) => {
    takeSnapshot();
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  /**
   * Removes a specific file from a stacked asset node
   * If it's the last file, removes the entire node
   *
   * @param nodeId - ID of the asset stack node
   * @param fileName - Name of the file to remove
   */
  removeFileFromNode: (nodeId: string, fileName: string) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node?.data.files) return;

    const updatedFiles = node.data.files.filter((f) => f.name !== fileName);

    // If no files left, remove the entire node
    if (updatedFiles.length === 0) {
      takeSnapshot();
      set({
        nodes: get().nodes.filter((n) => n.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
      return;
    }

    // Update the node with remaining files
    const totalSize = updatedFiles.reduce((acc, f) => acc + f.size, 0);
    takeSnapshot();
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                files: updatedFiles,
                label: `${updatedFiles.length} file${updatedFiles.length > 1 ? "s" : ""}`,
                description: formatFileSize(totalSize),
              },
            }
          : n
      ),
    });
  },

  /**
   * Sets the currently selected node
   *
   * @param nodeId - ID of node to select, or null to deselect
   */
  selectNode: (nodeId: string | null) => set({ selectedNodeId: nodeId }),

  /**
   * Updates specific data properties of a node
   *
   * @param nodeId - ID of the node to update
   * @param data - Partial data object to merge with existing node data
   */
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
    takeSnapshot();
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
});
