import { Edge } from "@xyflow/react";
import { WorkflowNode } from "../types/workflow";

/**
 * Graph traversal utilities for workflow execution
 *
 * Provides declarative API for topological traversal operations,
 * separating graph logic from execution orchestration.
 */

/**
 * Finds nodes with no incoming edges (entry points for workflow execution)
 *
 * @param nodes - All nodes in the workflow
 * @param edges - All edges in the workflow
 * @returns Array of starting nodes
 *
 * @example
 * ```ts
 * const startNodes = findStartingNodes(nodes, edges);
 * if (startNodes.length === 0) {
 *   // Circular or disconnected graph - may need fallback
 * }
 * ```
 */
export function findStartingNodes(nodes: WorkflowNode[], edges: Edge[]): WorkflowNode[] {
  // Count incoming edges for each node
  const incomingEdgeCounts = new Map<string, number>();
  nodes.forEach((n) => incomingEdgeCounts.set(n.id, 0));
  edges.forEach((e) => {
    const current = incomingEdgeCounts.get(e.target) || 0;
    incomingEdgeCounts.set(e.target, current + 1);
  });

  // Return nodes with 0 incoming edges
  return nodes.filter((n) => (incomingEdgeCounts.get(n.id) || 0) === 0);
}

/**
 * Gets all outgoing edges from a set of source nodes
 *
 * @param nodeIds - IDs of source nodes
 * @param edges - All edges in the workflow
 * @returns Array of edges originating from the specified nodes
 *
 * @example
 * ```ts
 * const outgoing = getOutgoingEdges(['node-1', 'node-2'], edges);
 * ```
 */
export function getOutgoingEdges(nodeIds: string[], edges: Edge[]): Edge[] {
  return edges.filter((e) => nodeIds.includes(e.source));
}

/**
 * Gets the next level of nodes to execute based on completed edges
 *
 * @param completedEdges - Edges whose data has finished traveling
 * @param nodes - All nodes in the workflow
 * @returns Array of nodes that should execute next
 *
 * @example
 * ```ts
 * const nextNodes = getNextLevelNodes(completedEdges, nodes);
 * ```
 */
export function getNextLevelNodes(completedEdges: Edge[], nodes: WorkflowNode[]): WorkflowNode[] {
  const nextNodeIds = completedEdges.map((e) => e.target);
  return nodes.filter((n) => nextNodeIds.includes(n.id));
}

/**
 * Gets a fallback starting node for circular or disconnected graphs
 *
 * @param nodes - All nodes in the workflow
 * @returns First node, or undefined if no nodes exist
 *
 * @example
 * ```ts
 * const startNodes = findStartingNodes(nodes, edges);
 * if (startNodes.length === 0 && nodes.length > 0) {
 *   const fallback = getFallbackStartNode(nodes);
 *   // Handle circular graph case
 * }
 * ```
 */
export function getFallbackStartNode(nodes: WorkflowNode[]): WorkflowNode | undefined {
  return nodes.length > 0 ? nodes[0] : undefined;
}
