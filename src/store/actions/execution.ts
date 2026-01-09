import { Edge } from "@xyflow/react";
import { WorkflowNode } from "../types/workflow";
import { ExecutionStatus, EdgeStatus } from "@/lib/workflowTheme";
import { createStatusController } from "../execution/statusController";
import { WorkflowExecutor } from "../execution/workflowExecutor";
import { ErrorStrategy } from "../execution/types";
import { waitFixed } from "../execution/timing";
import { ProcessingMode } from "../nodeHandlers/types";

/**
 * State getter interface for execution operations
 */
type ExecutionStateGetter = () => {
  nodes: WorkflowNode[];
  edges: Edge[];
  isRunning: boolean;
  nodeStatus: Record<string, ExecutionStatus>;
  edgeStatus: Record<string, EdgeStatus>;
};

/**
 * State setter interface for execution operations
 */
type ExecutionStateSetter = (partial: Partial<ReturnType<ExecutionStateGetter>>) => void;

/**
 * Context provided to execution action creators
 */
interface ExecutionActionsContext {
  get: ExecutionStateGetter;
  set: ExecutionStateSetter;
}

/**
 * Creates execution/runner actions for workflow visualization
 *
 * @param context - Zustand get/set functions
 * @returns Object with execution action methods
 */
export const createExecutionActions = ({ get, set }: ExecutionActionsContext) => {
  // Create status controller for batched UI updates
  const statusController = createStatusController(
    () => ({
      nodeStatus: get().nodeStatus,
      edgeStatus: get().edgeStatus,
    }),
    (partial) => set(partial)
  );

  return {
    /**
     * Sets the workflow running state
     *
     * @param isRunning - Whether the workflow is currently executing
     */
    setIsRunning: (isRunning: boolean) => set({ isRunning }),

    /**
     * Sets a node's visual status to running (UI-only, no domain logic)
     *
     * @param nodeId - ID of the node
     */
    setNodeVisualRunning: (nodeId: string) => {
      statusController.updateNodeStatus(nodeId, "running");
    },

    /**
     * Sets a node's visual status to completed (UI-only, no domain logic)
     *
     * @param nodeId - ID of the node
     */
    setNodeVisualCompleted: (nodeId: string) => {
      statusController.updateNodeStatus(nodeId, "completed");
    },

    /**
     * Sets a node's visual status to error (UI-only, no domain logic)
     *
     * @param nodeId - ID of the node
     */
    setNodeVisualError: (nodeId: string) => {
      statusController.updateNodeStatus(nodeId, "error");
    },

    /**
     * Sets an edge's visual status to running (UI-only, no domain logic)
     *
     * @param edgeId - ID of the edge
     */
    setEdgeVisualRunning: (edgeId: string) => {
      statusController.updateEdgeStatus(edgeId, "running");
    },

    /**
     * Sets an edge's visual status to completed (UI-only, no domain logic)
     *
     * @param edgeId - ID of the edge
     */
    setEdgeVisualCompleted: (edgeId: string) => {
      statusController.updateEdgeStatus(edgeId, "completed");
    },

    /**
     * Resets all execution state (nodes, edges, running flag)
     */
    resetExecution: () => {
      set({ nodeStatus: {}, edgeStatus: {}, isRunning: false });
    },

    /**
     * Executes the entire workflow with visual feedback
     *
     * Use WorkflowExecutor for clean separation of:
     * - Graph traversal logic (workflowExecutor)
     * - UI status updates (statusController)
     * - Timing (timing utilities)
     * - Error handling (configurable strategies)
     * - Node processing (handlers)
     *
     * @param errorStrategy - How to handle node failures (default: "halt")
     * @param processingMode - How to process nodes in each level (default: "parallel")
     */
    runWorkflow: async (errorStrategy: ErrorStrategy = "halt", processingMode: ProcessingMode = "parallel") => {
      const state = get();
      const { nodes, edges } = state;

      // Mark workflow as running
      set({ isRunning: true });
      console.log("[Workflow] Starting execution...");

      // Create executor with status controller
      const executor = new WorkflowExecutor(nodes, edges, statusController, errorStrategy, processingMode);

      // Initialize and find starting nodes
      const hasStartingNodes = executor.prepare();
      if (!hasStartingNodes) {
        console.warn("[Workflow] No nodes to execute. Workflow is empty.");
        await waitFixed(1000);
        set({ isRunning: false });
        return;
      }

      // Execute workflow level by level
      while (executor.hasNextLevel()) {
        const result = await executor.executeLevel();

        if (!result.shouldContinue) {
          if (!result.success) {
            console.error("[Workflow] Execution halted due to errors in nodes:", result.failedNodeIds);
          }
          break;
        }
      }

      // Workflow complete
      console.log("[Workflow] Execution complete.");
      const failedNodes = executor.getFailedNodes();
      if (failedNodes.length > 0) {
        console.warn("[Workflow] Completed with errors:", failedNodes);
      }

      await waitFixed(1000);
      set({ isRunning: false });
    },
  };
};
