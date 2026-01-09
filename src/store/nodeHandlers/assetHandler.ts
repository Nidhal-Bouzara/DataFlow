import { WorkflowNode, FileAsset } from "../types/workflow";
import { NodeHandler, NodeInput, NodeOutput, NodeProcessingResult, ProcessingMode } from "./types";

/**
 * Asset Handler
 *
 * Handles asset and assetStack nodes by passing file data
 * as outputs for downstream processing.
 *
 * These are data source nodes (no incoming edges), so they
 * don't process inputs - they only produce outputs.
 */
export class AssetHandler implements NodeHandler {
  /**
   * Process an asset node - convert file metadata to outputs
   */
  async process(node: WorkflowNode, _inputs: NodeInput[], _mode?: ProcessingMode): Promise<NodeProcessingResult> {
    const validation = this.validate(node);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const { nodeType, file, files } = node.data;

    try {
      let outputs: NodeOutput[] = [];

      if (nodeType === "asset" && file) {
        // Single file asset
        outputs = [this.fileAssetToOutput(file)];
      } else if (nodeType === "assetStack" && files) {
        // Multiple file assets
        outputs = files.map((f) => this.fileAssetToOutput(f));
      }

      const workflowState = {
        nodeId: node.id,
        timestamp: Date.now(),
        inputs: [], // Asset nodes have no inputs
        outputs,
        metadata: {
          fileCount: outputs.length,
          totalSize: outputs.reduce((sum, out) => sum + ((out.metadata?.size as number) || 0), 0),
        },
      };

      console.log(`[AssetHandler] Prepared ${outputs.length} file(s) from ${nodeType} node`);

      return {
        success: true,
        outputs,
        workflowState,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process asset",
      };
    }
  }

  /**
   * Validate asset node has required file data
   */
  validate(node: WorkflowNode): { valid: boolean; error?: string } {
    const { nodeType, file, files } = node.data;

    if (nodeType === "asset") {
      if (!file) {
        return {
          valid: false,
          error: "Asset node requires a file",
        };
      }
      if (!file.blob) {
        return {
          valid: false,
          error: "Asset file is missing blob data for processing",
        };
      }
    }

    if (nodeType === "assetStack") {
      if (!files || files.length === 0) {
        return {
          valid: false,
          error: "AssetStack node requires at least one file",
        };
      }
      const missingBlobs = files.filter((f) => !f.blob);
      if (missingBlobs.length > 0) {
        return {
          valid: false,
          error: `${missingBlobs.length} file(s) missing blob data for processing`,
        };
      }
    }

    return { valid: true };
  }

  // ─────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────

  /**
   * Convert FileAsset to NodeOutput
   */
  private fileAssetToOutput(fileAsset: FileAsset): NodeOutput {
    return {
      type: "file",
      data: fileAsset.blob!, // We validated blob exists
      metadata: {
        fileName: fileAsset.name,
        size: fileAsset.size,
        mimeType: fileAsset.type,
      },
    };
  }
}
