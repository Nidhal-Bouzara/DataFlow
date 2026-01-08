import { create } from "zustand";

// Types
import { WorkflowState, WorkflowNode, NodeType, FileAsset } from "./types/workflow";

// Initial data
import { initialNodes, initialEdges } from "@/data/initialWorkflow";

// Action creators
import { createHistoryActions } from "./actions/history";
import { createNodeActions } from "./actions/nodes";
import { createEdgeActions } from "./actions/edges";
import { createExecutionActions } from "./actions/execution";

// Re-export types for backward compatibility
export type { WorkflowNode, NodeType, FileAsset };

// Re-export constants for backward compatibility
export { nodeDefaults } from "./constants/nodeDefaults";

/**
 * Main Workflow Store
 *
 * Declarative composition of state and actions.
 * Implementation details are organized in modular files:
 * - src/store/types/workflow.ts - Type definitions
 * - src/store/constants/nodeDefaults.ts - Node configurations
 * - src/store/actions/history.ts - Undo/redo functionality
 * - src/store/actions/nodes.ts - Node CRUD operations
 * - src/store/actions/edges.ts - Edge operations
 * - src/store/actions/execution.ts - Workflow runner logic
 */
export const useWorkflowStore = create<WorkflowState>((set, get) => {
  // ─────────────────────────────────────────────────
  // Create action modules with shared context
  // ─────────────────────────────────────────────────
  const historyActions = createHistoryActions({ get, set });
  const nodeActions = createNodeActions({
    get,
    set,
    takeSnapshot: historyActions.takeSnapshot,
  });
  const edgeActions = createEdgeActions({
    get,
    set,
    takeSnapshot: historyActions.takeSnapshot,
  });
  const executionActions = createExecutionActions({ get, set });

  return {
    // ─────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId: null,

    // History state
    past: [],
    future: [],

    // Execution state
    isRunning: false,
    nodeStatus: {},
    edgeStatus: {},

    // ─────────────────────────────────────────────────
    // ACTIONS (Composed from modules)
    // ─────────────────────────────────────────────────

    // History
    ...historyActions,

    // Nodes
    ...nodeActions,

    // Edges
    ...edgeActions,

    // Execution
    ...executionActions,
  };
});
