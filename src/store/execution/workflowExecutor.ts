import { Edge } from "@xyflow/react";
import { WorkflowNode } from "../types/workflow";
import { ErrorStrategy, LevelExecutionResult } from "./types";
import { StatusController } from "./statusController";
import { findStartingNodes, getFallbackStartNode, getOutgoingEdges, getNextLevelNodes } from "../utils/graphTraversal";
import { handlerRegistry } from "../nodeHandlers";
import { collectNodeInputs, NodeOutputMap } from "./inputCollector";
import { ProcessingMode, NodeProcessingResult } from "../nodeHandlers/types";

/**
 * Workflow Executor
 *
 * High-level orchestrator that composes graph traversal, timing,
 * and status updates into a clean execution flow.
 *
 * Separates:
 * - Graph traversal logic (which nodes to execute next)
 * - UI status updates (visual feedback)
 * - Domain logic (future: actual data processing per node)
 * - Error handling (configurable strategies)
 */
export class WorkflowExecutor {
  private nodes: WorkflowNode[];
  private edges: Edge[];
  private statusController: StatusController;
  private errorStrategy: ErrorStrategy;
  private processingMode: ProcessingMode;
  private currentLevel: WorkflowNode[];
  private failedNodes: Set<string>;
  private nodeOutputs: NodeOutputMap;

  constructor(nodes: WorkflowNode[], edges: Edge[], statusController: StatusController, errorStrategy: ErrorStrategy = "halt", processingMode: ProcessingMode = "parallel") {
    this.nodes = nodes;
    this.edges = edges;
    this.statusController = statusController;
    this.errorStrategy = errorStrategy;
    this.processingMode = processingMode;
    this.currentLevel = [];
    this.failedNodes = new Set();
    this.nodeOutputs = new Map();
  }

  /**
   * Initializes the executor and finds starting nodes
   *
   * @returns true if starting nodes found, false if empty workflow
   */
  prepare(): boolean {
    this.statusController.resetAllStatuses();
    this.failedNodes.clear();
    this.nodeOutputs.clear();

    // Find nodes with no incoming edges
    this.currentLevel = findStartingNodes(this.nodes, this.edges);

    // Fallback for circular or disconnected graphs
    if (this.currentLevel.length === 0 && this.nodes.length > 0) {
      const fallbackNode = getFallbackStartNode(this.nodes);
      if (fallbackNode) {
        this.currentLevel = [fallbackNode];
        console.warn("No starting nodes found (circular or disconnected graph). " + `Starting with fallback node: ${fallbackNode.id}`);
      }
    }

    return this.currentLevel.length > 0;
  }

  /**
   * Checks if there are more nodes to execute
   */
  hasNextLevel(): boolean {
    return this.currentLevel.length > 0;
  }

  /**
   * Executes the current level of nodes
   *
   * Flow:
   * 1. Start nodes (set visual status to running)
   * 2. Complete nodes (set visual status to completed/error)
   * 3. Activate outgoing edges (set visual status to running)
   * 4. Complete edges (set visual status to completed)
   * 5. Advance to next level
   *
   * @returns Result indicating success and whether to continue
   */
  async executeLevel(): Promise<LevelExecutionResult> {
    const nodeIds = this.currentLevel.map((n) => n.id);

    console.log(`[Executor] Starting Level: ${nodeIds.join(", ")}`);

    // ──────────────────────────────────────────────────
    // STEP 1: Start Nodes (Visual Status)
    // ──────────────────────────────────────────────────
    const nodeStartUpdates = nodeIds.reduce((acc, id) => ({ ...acc, [id]: "running" as const }), {});
    this.statusController.batchUpdateNodeStatuses(nodeStartUpdates);

    // ──────────────────────────────────────────────────
    // STEP 2: Process Nodes & Handle Errors
    // ──────────────────────────────────────────────────
    const processingResults = await this.processNodes(this.currentLevel);
    const failedNodes = processingResults.filter((r) => !r.result.success).map((r) => r.nodeId);

    if (failedNodes.length > 0) {
      return this.handleFailures(processingResults.filter((r) => !r.result.success));
    }

    // Store outputs for downstream nodes
    processingResults.forEach((r) => {
      if (r.result.workflowState) {
        this.nodeOutputs.set(r.nodeId, r.result.workflowState);
      }
    });

    // ──────────────────────────────────────────────────
    // STEP 3: Complete Nodes (Visual Status)
    // ──────────────────────────────────────────────────
    const nodeCompleteUpdates = nodeIds.reduce((acc, id) => ({ ...acc, [id]: "completed" as const }), {});
    this.statusController.batchUpdateNodeStatuses(nodeCompleteUpdates);

    console.log(`[Executor] Completed Level: ${nodeIds.join(", ")}`);

    // ──────────────────────────────────────────────────
    // STEP 4: Find & Activate Outgoing Edges
    // ──────────────────────────────────────────────────
    const outgoingEdges = getOutgoingEdges(nodeIds, this.edges);

    if (outgoingEdges.length === 0) {
      console.log("[Executor] No outgoing edges. Execution branch ended.");
      this.currentLevel = [];
      return { success: true, shouldContinue: false };
    }

    const edgeIds = outgoingEdges.map((e) => e.id);
    console.log(`[Executor] Activating Edges: ${edgeIds.join(", ")}`);

    const edgeStartUpdates = edgeIds.reduce((acc, id) => ({ ...acc, [id]: "running" as const }), {});
    this.statusController.batchUpdateEdgeStatuses(edgeStartUpdates);

    // ──────────────────────────────────────────────────
    // STEP 5: Complete Edges (Visual Status)
    // ──────────────────────────────────────────────────
    const edgeCompleteUpdates = edgeIds.reduce((acc, id) => ({ ...acc, [id]: "completed" as const }), {});
    this.statusController.batchUpdateEdgeStatuses(edgeCompleteUpdates);

    // ──────────────────────────────────────────────────
    // STEP 6: Advance to Next Level
    // ──────────────────────────────────────────────────
    this.currentLevel = getNextLevelNodes(outgoingEdges, this.nodes);

    return {
      success: true,
      shouldContinue: this.currentLevel.length > 0,
    };
  }

  /**
   * Processes nodes using registered handlers
   *
   * Calls appropriate handler based on node type, collects inputs
   * from predecessor nodes, and returns processing results.
   */
  private async processNodes(nodes: WorkflowNode[]): Promise<Array<{ nodeId: string; result: NodeProcessingResult }>> {
    const results: Array<{ nodeId: string; result: NodeProcessingResult }> = [];

    // Process nodes based on mode
    if (this.processingMode === "sequential") {
      // Sequential: Process one at a time
      for (const node of nodes) {
        const result = await this.processNode(node);
        results.push({ nodeId: node.id, result });
      }
    } else {
      // Parallel: Process all at once
      const promises = nodes.map(async (node) => ({
        nodeId: node.id,
        result: await this.processNode(node),
      }));
      results.push(...(await Promise.all(promises)));
    }

    return results;
  }

  /**
   * Process a single node with its handler
   */
  private async processNode(node: WorkflowNode): Promise<NodeProcessingResult> {
    const { nodeType } = node.data;

    // Get handler for this node type
    const handler = handlerRegistry.getHandler(nodeType);
    if (!handler) {
      console.warn(`[Executor] No handler registered for node type: ${nodeType}`);
      return {
        success: false,
        error: `No handler available for node type: ${nodeType}`,
      };
    }

    // Collect inputs from predecessor nodes
    const inputs = collectNodeInputs(node.id, this.edges, this.nodeOutputs);

    try {
      // Call handler to process the node
      const result = await handler.process(node, inputs, this.processingMode);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown processing error",
      };
    }
  }

  /**
   * Handles node failures based on error strategy
   */
  private handleFailures(failures: Array<{ nodeId: string; result: NodeProcessingResult }>): LevelExecutionResult {
    const failedNodeIds = failures.map((f) => f.nodeId);

    // Mark failed nodes visually
    const errorUpdates = failedNodeIds.reduce((acc, id) => ({ ...acc, [id]: "error" as const }), {});
    this.statusController.batchUpdateNodeStatuses(errorUpdates);

    // Track failures
    failedNodeIds.forEach((id) => this.failedNodes.add(id));

    console.error(
      `[Executor] Nodes failed: ${failedNodeIds.join(", ")}`,
      failures.map((f) => f.result.error)
    );

    // Apply error strategy
    switch (this.errorStrategy) {
      case "halt":
        console.log("[Executor] Error strategy: HALT. Stopping execution.");
        this.currentLevel = [];
        return {
          success: false,
          failedNodeIds,
          shouldContinue: false,
        };

      case "continue":
        console.log("[Executor] Error strategy: CONTINUE. " + "Skipping failed branch, continuing other branches.");
        // Remove failed nodes from current level, continue with rest
        this.currentLevel = this.currentLevel.filter((n) => !failedNodeIds.includes(n.id));
        return {
          success: false,
          failedNodeIds,
          shouldContinue: this.currentLevel.length > 0,
        };

      case "retry":
        // Future implementation
        console.warn("[Executor] Error strategy: RETRY not yet implemented. " + "Falling back to HALT.");
        this.currentLevel = [];
        return {
          success: false,
          failedNodeIds,
          shouldContinue: false,
        };

      default:
        return {
          success: false,
          failedNodeIds,
          shouldContinue: false,
        };
    }
  }

  /**
   * Gets the IDs of all failed nodes so far
   */
  getFailedNodes(): string[] {
    return Array.from(this.failedNodes);
  }

  /**
   * Gets workflow state for a specific node
   * Used by artifact nodes to display intermediate results
   */
  getNodeState(nodeId: string) {
    return this.nodeOutputs.get(nodeId);
  }

  /**
   * Gets all workflow states (useful for debugging)
   */
  getAllStates() {
    return this.nodeOutputs;
  }
}
