import { Edge } from "@xyflow/react";
import { NodeInput, WorkflowNodeState } from "../nodeHandlers/types";

/**
 * Map of node outputs by node ID
 */
export type NodeOutputMap = Map<string, WorkflowNodeState>;

/**
 * Collects inputs for a node from its predecessor nodes
 *
 * Traverses incoming edges to gather outputs from all nodes
 * that feed into the target node.
 *
 * @param nodeId - ID of the node to collect inputs for
 * @param edges - All edges in the workflow
 * @param nodeOutputs - Map of node outputs by node ID
 * @returns Array of inputs from predecessor nodes
 *
 * @example
 * ```ts
 * const inputs = collectNodeInputs("process-1", edges, nodeOutputs);
 * // Returns: [
 * //   { sourceNodeId: "extract-1", type: "text", data: "..." },
 * //   { sourceNodeId: "extract-2", type: "text", data: "..." }
 * // ]
 * ```
 */
export function collectNodeInputs(nodeId: string, edges: Edge[], nodeOutputs: NodeOutputMap): NodeInput[] {
  // Find all edges that target this node
  const incomingEdges = edges.filter((edge) => edge.target === nodeId);

  if (incomingEdges.length === 0) {
    // No incoming edges - this is a starting node (asset/assetStack)
    return [];
  }

  // Collect outputs from source nodes
  const inputs: NodeInput[] = [];

  for (const edge of incomingEdges) {
    const sourceNodeState = nodeOutputs.get(edge.source);

    if (!sourceNodeState) {
      console.warn(`[InputCollector] No outputs found for source node: ${edge.source}. ` + "This may indicate the source node hasn't been processed yet.");
      continue;
    }

    // Convert each output from the source node into an input
    for (const output of sourceNodeState.outputs) {
      inputs.push({
        sourceNodeId: edge.source,
        type: output.type as NodeInput["type"],
        data: output.data,
        metadata: {
          ...output.metadata,
          edgeId: edge.id,
          sourceTimestamp: sourceNodeState.timestamp,
        },
      });
    }
  }

  return inputs;
}

/**
 * Validates that all required inputs are present for a node
 *
 * Checks if a node has all necessary inputs from predecessor nodes.
 * Used to determine if a node is ready to execute.
 *
 * @param nodeId - ID of the node to validate
 * @param edges - All edges in the workflow
 * @param nodeOutputs - Map of node outputs by node ID
 * @returns True if all required inputs are available
 */
export function hasRequiredInputs(nodeId: string, edges: Edge[], nodeOutputs: NodeOutputMap): boolean {
  const incomingEdges = edges.filter((edge) => edge.target === nodeId);

  // Starting nodes (no incoming edges) are always ready
  if (incomingEdges.length === 0) {
    return true;
  }

  // Check if all source nodes have produced outputs
  // todo - check for specific required input types based on node
  return incomingEdges.every((edge) => nodeOutputs.has(edge.source));
}

/**
 * Groups inputs by source node
 *
 * Useful for handlers that need to process inputs from each
 * source separately before combining.
 *
 * @param inputs - Array of node inputs
 * @returns Map of inputs grouped by source node ID
 */
export function groupInputsBySource(inputs: NodeInput[]): Map<string, NodeInput[]> {
  const grouped = new Map<string, NodeInput[]>();

  for (const input of inputs) {
    const existing = grouped.get(input.sourceNodeId) || [];
    grouped.set(input.sourceNodeId, [...existing, input]);
  }

  return grouped;
}

/**
 * Filters inputs by type
 *
 * @param inputs - Array of node inputs
 * @param types - Types to filter by
 * @returns Filtered inputs matching the specified types
 */
export function filterInputsByType(inputs: NodeInput[], ...types: NodeInput["type"][]): NodeInput[] {
  return inputs.filter((input) => types.includes(input.type));
}
