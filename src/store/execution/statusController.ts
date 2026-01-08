import { ExecutionStatus, EdgeStatus } from "@/lib/workflowTheme";

/**
 * Status controller for batched UI updates during workflow execution
 *
 * Provides efficient batched status updates to minimize state updates
 * and component re-renders during workflow execution.
 */

/**
 * State setter interface for status updates
 */
type StatusStateSetter = (partial: { nodeStatus?: Record<string, ExecutionStatus>; edgeStatus?: Record<string, EdgeStatus> }) => void;

/**
 * State getter interface for current status
 */
type StatusStateGetter = () => {
  nodeStatus: Record<string, ExecutionStatus>;
  edgeStatus: Record<string, EdgeStatus>;
};

/**
 * Creates a status controller for batched visual status updates
 *
 * @param get - Zustand state getter
 * @param set - Zustand state setter
 * @returns Status controller with batched update methods
 */
export function createStatusController(get: StatusStateGetter, set: StatusStateSetter) {
  return {
    /**
     * Updates multiple node statuses in a single state update
     *
     * More efficient than individual updates when setting status
     * for multiple nodes (e.g., starting a level of parallel nodes)
     *
     * @param updates - Map of nodeId to new status
     *
     * @example
     * ```ts
     * statusController.batchUpdateNodeStatuses({
     *   'node-1': 'running',
     *   'node-2': 'running',
     *   'node-3': 'running'
     * });
     * ```
     */
    batchUpdateNodeStatuses(updates: Record<string, ExecutionStatus>): void {
      const { nodeStatus } = get();
      set({ nodeStatus: { ...nodeStatus, ...updates } });
    },

    /**
     * Updates multiple edge statuses in a single state update
     *
     * @param updates - Map of edgeId to new status
     *
     * @example
     * ```ts
     * statusController.batchUpdateEdgeStatuses({
     *   'edge-1': 'running',
     *   'edge-2': 'running'
     * });
     * ```
     */
    batchUpdateEdgeStatuses(updates: Record<string, EdgeStatus>): void {
      const { edgeStatus } = get();
      set({ edgeStatus: { ...edgeStatus, ...updates } });
    },

    /**
     * Updates a complete level's statuses in one batch
     *
     * Handles the common pattern of completing nodes and activating
     * their outgoing edges in a single state update.
     *
     * @param nodeIds - IDs of nodes to update
     * @param nodeStatus - Status to set for nodes
     * @param edgeIds - IDs of edges to update
     * @param edgeStatus - Status to set for edges
     *
     * @example
     * ```ts
     * // Complete nodes and activate outgoing edges
     * statusController.updateLevelStatuses(
     *   ['node-1', 'node-2'], 'completed',
     *   ['edge-1', 'edge-2'], 'running'
     * );
     * ```
     */
    updateLevelStatuses(nodeIds: string[], nodeStatusValue: ExecutionStatus, edgeIds: string[], edgeStatusValue: EdgeStatus): void {
      const currentState = get();

      const nodeUpdates = nodeIds.reduce((acc, id) => ({ ...acc, [id]: nodeStatusValue }), {} as Record<string, ExecutionStatus>);

      const edgeUpdates = edgeIds.reduce((acc, id) => ({ ...acc, [id]: edgeStatusValue }), {} as Record<string, EdgeStatus>);

      set({
        nodeStatus: { ...currentState.nodeStatus, ...nodeUpdates },
        edgeStatus: { ...currentState.edgeStatus, ...edgeUpdates },
      });
    },

    /**
     * Updates a single node's visual status
     *
     * Use for individual node updates (e.g., error handling).
     * Prefer batch methods for multiple updates.
     *
     * @param nodeId - ID of the node
     * @param status - New status to set
     */
    updateNodeStatus(nodeId: string, status: ExecutionStatus): void {
      const { nodeStatus } = get();
      set({ nodeStatus: { ...nodeStatus, [nodeId]: status } });
    },

    /**
     * Updates a single edge's visual status
     *
     * @param edgeId - ID of the edge
     * @param status - New status to set
     */
    updateEdgeStatus(edgeId: string, status: EdgeStatus): void {
      const { edgeStatus } = get();
      set({ edgeStatus: { ...edgeStatus, [edgeId]: status } });
    },

    /**
     * Resets all statuses to idle (workflow preparation)
     */
    resetAllStatuses(): void {
      set({ nodeStatus: {}, edgeStatus: {} });
    },
  };
}

/**
 * Type for the status controller instance
 */
export type StatusController = ReturnType<typeof createStatusController>;
