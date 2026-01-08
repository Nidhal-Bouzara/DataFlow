import { WorkflowNode } from "../types/workflow";
import { ExecutionStatus, EdgeStatus } from "@/lib/workflowTheme";

/**
 * Error handling strategy for workflow execution
 */
export type ErrorStrategy =
  | "halt" // Stop execution immediately on first error
  | "continue" // Continue executing other branches, skip failed branch
  | "retry"; // Retry failed node (future implementation)

/**
 * Result of processing a single node
 */
export interface NodeProcessingResult {
  /** Whether the node processed successfully */
  success: boolean;

  /** Error message if processing failed */
  error?: string;

  /** Output data from the node (for future data pipeline implementation) */
  outputs?: Record<string, unknown>;
}

/**
 * Interface for node processing logic
 *
 * Future extension point for implementing actual data transformation
 * per node type (extract text, process text, etc.)
 */
export interface NodeProcessor {
  /**
   * Processes a node with given inputs
   *
   * @param node - The workflow node to process
   * @param inputs - Input data from preceding nodes
   * @returns Processing result with success status and outputs
   */
  processNode(node: WorkflowNode, inputs: Record<string, unknown>): Promise<NodeProcessingResult>;
}

/**
 * Context for workflow execution
 */
export interface ExecutionContext {
  /** All nodes in the workflow */
  nodes: WorkflowNode[];

  /** Error handling strategy */
  errorStrategy: ErrorStrategy;

  /** Optional processor for actual data transformation */
  nodeProcessor?: NodeProcessor;

  /** Callback to update node visual status */
  updateNodeStatus: (nodeId: string, status: ExecutionStatus) => void;

  /** Callback to update edge visual status */
  updateEdgeStatus: (edgeId: string, status: EdgeStatus) => void;

  /** Callback to batch update multiple node statuses */
  batchUpdateNodeStatuses: (updates: Record<string, ExecutionStatus>) => void;

  /** Callback to batch update multiple edge statuses */
  batchUpdateEdgeStatuses: (updates: Record<string, EdgeStatus>) => void;
}

/**
 * Result of executing a level in the workflow
 */
export interface LevelExecutionResult {
  /** Whether the level executed successfully */
  success: boolean;

  /** IDs of nodes that failed (if any) */
  failedNodeIds?: string[];

  /** Whether execution should continue to next level */
  shouldContinue: boolean;
}
