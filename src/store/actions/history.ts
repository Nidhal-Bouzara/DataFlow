import { WorkflowNode } from "../types/workflow";
import { Edge } from "@xyflow/react";

/**
 * State getter interface for history operations
 */
type HistoryStateGetter = () => {
  nodes: WorkflowNode[];
  edges: Edge[];
  past: { nodes: WorkflowNode[]; edges: Edge[] }[];
  future: { nodes: WorkflowNode[]; edges: Edge[] }[];
};

/**
 * State setter interface for history operations
 */
type HistoryStateSetter = (partial: Partial<ReturnType<HistoryStateGetter>>) => void;

/**
 * Context provided to history action creators
 */
interface HistoryActionsContext {
  get: HistoryStateGetter;
  set: HistoryStateSetter;
}

/**
 * Creates history management actions (undo/redo/snapshot)
 *
 * @param context - Zustand get/set functions
 * @returns Object with history action methods
 */
export const createHistoryActions = ({ get, set }: HistoryActionsContext) => ({
  /**
   * Captures the current state as a snapshot for undo functionality
   * Called before any mutation operation
   */
  takeSnapshot: () => {
    const { nodes, edges, past } = get();
    set({
      past: [...past, { nodes, edges }],
      future: [],
    });
  },

  /**
   * Reverts to the previous state snapshot
   * Moves current state to future stack
   */
  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future],
    });
  },

  /**
   * Restores a previously undone state
   * Moves state from future back to past
   */
  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      past: [...past, { nodes, edges }],
      future: future.slice(1),
    });
  },
});
