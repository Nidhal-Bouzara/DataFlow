import { Edge } from "@xyflow/react";
import { WorkflowNode } from "../types/workflow";
import { ExecutionStatus, EdgeStatus, WORKFLOW_THEME } from "@/lib/workflowTheme";

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
 * Helper function to wait for a specified duration
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper function to generate random delay within range
 */
const randomDelay = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * Creates execution/runner actions for workflow visualization
 *
 * @param context - Zustand get/set functions
 * @returns Object with execution action methods
 */
export const createExecutionActions = ({ get, set }: ExecutionActionsContext) => ({
  /**
   * Sets the workflow running state
   *
   * @param isRunning - Whether the workflow is currently executing
   */
  setIsRunning: (isRunning: boolean) => set({ isRunning }),

  /**
   * Marks a node as currently executing
   *
   * @param nodeId - ID of the node to start
   */
  startNode: (nodeId: string) => {
    const { nodeStatus } = get();
    set({ nodeStatus: { ...nodeStatus, [nodeId]: "running" } });
  },

  /**
   * Marks a node as successfully completed
   *
   * @param nodeId - ID of the node to complete
   */
  completeNode: (nodeId: string) => {
    const { nodeStatus } = get();
    set({ nodeStatus: { ...nodeStatus, [nodeId]: "completed" } });
  },

  /**
   * Marks a node as failed/errored
   *
   * @param nodeId - ID of the node that failed
   */
  failNode: (nodeId: string) => {
    const { nodeStatus } = get();
    set({ nodeStatus: { ...nodeStatus, [nodeId]: "error" } });
  },

  /**
   * Marks an edge as actively transferring data
   *
   * @param edgeId - ID of the edge to activate
   */
  activateEdge: (edgeId: string) => {
    const { edgeStatus } = get();
    set({ edgeStatus: { ...edgeStatus, [edgeId]: "running" } });
  },

  /**
   * Marks an edge as completed data transfer
   *
   * @param edgeId - ID of the edge to complete
   */
  completeEdge: (edgeId: string) => {
    const { edgeStatus } = get();
    set({ edgeStatus: { ...edgeStatus, [edgeId]: "completed" } });
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
   * Algorithm:
   * 1. Finds starting nodes (nodes with no incoming edges)
   * 2. Executes nodes level-by-level in topological order
   * 3. For each level:
   *    - Starts all nodes in parallel
   *    - Waits for random processing time
   *    - Completes all nodes
   *    - Activates outgoing edges
   *    - Waits for edge travel time
   *    - Completes edges
   *    - Moves to next level
   */
  runWorkflow: async () => {
    const state = get();
    const { nodes, edges } = state;

    // Reset execution state
    set({ nodeStatus: {}, edgeStatus: {}, isRunning: true });

    // Find starting nodes (nodes with no incoming edges)
    const incomingEdgeCounts = new Map<string, number>();
    nodes.forEach((n) => incomingEdgeCounts.set(n.id, 0));
    edges.forEach((e) => {
      const current = incomingEdgeCounts.get(e.target) || 0;
      incomingEdgeCounts.set(e.target, current + 1);
    });

    // Start with nodes that have 0 incoming edges
    let currentLevelNodes = nodes.filter((n) => (incomingEdgeCounts.get(n.id) || 0) === 0);

    // Fallback for circular graphs or graphs with no clear start
    if (currentLevelNodes.length === 0 && nodes.length > 0) {
      currentLevelNodes = [nodes[0]];
    }

    // Execution timing from theme
    const { min, max } = WORKFLOW_THEME.execution.nodeProcessTime;
    const edgeTravelTime = WORKFLOW_THEME.execution.edgeTravelTime;

    console.log("Starting Workflow Execution");

    // Execute workflow level by level
    while (currentLevelNodes.length > 0) {
      const nodeIds = currentLevelNodes.map((n) => n.id);

      // A. START NODES
      console.log("Starting Nodes:", nodeIds);
      const { nodeStatus: currentNodeStatus } = get();
      const startedNodeStatus = { ...currentNodeStatus };
      nodeIds.forEach((id) => (startedNodeStatus[id] = "running"));
      set({ nodeStatus: startedNodeStatus });

      // Simulate processing time
      await wait(randomDelay(min, max));

      // B. COMPLETE NODES
      console.log("Completing Nodes:", nodeIds);
      const { nodeStatus: afterWaitStatus } = get();
      const completedNodeStatus = { ...afterWaitStatus };
      nodeIds.forEach((id) => (completedNodeStatus[id] = "completed"));
      set({ nodeStatus: completedNodeStatus });

      // Find outgoing edges from completed nodes
      const nextEdges = edges.filter((e) => nodeIds.includes(e.source));

      if (nextEdges.length === 0) {
        console.log("No more outgoing edges. Branch ended.");
        break;
      }

      // C. ACTIVATE EDGES (Data Travel)
      const edgeIds = nextEdges.map((e) => e.id);
      console.log("Activating Edges:", edgeIds);
      const { edgeStatus: currentEdgeStatus } = get();
      const activatedEdgeStatus = { ...currentEdgeStatus };
      edgeIds.forEach((id) => (activatedEdgeStatus[id] = "running"));
      set({ edgeStatus: activatedEdgeStatus });

      // Wait for data to travel through edges
      await wait(edgeTravelTime);

      // D. COMPLETE EDGES (Data Arrival)
      const { edgeStatus: afterEdgeWaitStatus } = get();
      const completedEdgeStatus = { ...afterEdgeWaitStatus };
      edgeIds.forEach((id) => (completedEdgeStatus[id] = "completed"));
      set({ edgeStatus: completedEdgeStatus });

      // Prepare next level of nodes
      const nextNodeIds = nextEdges.map((e) => e.target);
      currentLevelNodes = nodes.filter((n) => nextNodeIds.includes(n.id));
    }

    // Workflow complete
    await wait(1000);
    set({ isRunning: false });
  },
});
