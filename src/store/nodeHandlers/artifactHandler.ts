import { WorkflowNode } from "../types/workflow";
import { NodeHandler, NodeInput, NodeOutput, NodeProcessingResult, ProcessingMode } from "./types";

/**
 * Artifact Handler
 *
 * Handles artifact nodes which serve as visualization/output points
 * in the workflow. They collect inputs from predecessor nodes and
 * make them viewable to users while passing them through unchanged.
 *
 * Purpose:
 * - Display intermediate workflow results to users
 * - Act as checkpoints in the workflow
 * - Pass through inputs as outputs for downstream nodes
 */
export class ArtifactHandler implements NodeHandler {
  /**
   * Process an artifact node - passthrough inputs as outputs
   */
  async process(node: WorkflowNode, inputs: NodeInput[], _mode?: ProcessingMode): Promise<NodeProcessingResult> {
    const validation = this.validate(node);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    try {
      // Artifact nodes simply collect and display inputs
      // Convert inputs to outputs (passthrough)
      const outputs: NodeOutput[] = inputs.map((input) => ({
        type: input.type === "unknown" ? "text" : input.type, // Map unknown to text for output
        data: input.data,
        metadata: {
          ...input.metadata,
          sourceNodeId: input.sourceNodeId,
          capturedAt: Date.now(),
        },
      }));

      const workflowState = {
        nodeId: node.id,
        timestamp: Date.now(),
        inputs,
        outputs,
        metadata: {
          inputCount: inputs.length,
          artifactName: node.data.config?.name || node.data.label,
          captureMode: "passthrough",
        },
      };

      console.log(`[ArtifactHandler] Captured ${inputs.length} input(s) for artifact: ${node.data.label}`);

      return {
        success: true,
        outputs,
        workflowState,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process artifact",
      };
    }
  }

  /**
   * Validate artifact node
   *
   * Artifacts don't have strict requirements, but they should
   * have at least one input to display
   */
  validate(node: WorkflowNode): { valid: boolean; error?: string } {
    const { nodeType } = node.data;

    if (nodeType !== "artifact") {
      return {
        valid: false,
        error: `Invalid node type for ArtifactHandler: ${nodeType}`,
      };
    }

    // Artifacts are always valid - they can capture any inputs
    return { valid: true };
  }
}
