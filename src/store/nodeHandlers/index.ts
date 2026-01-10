/**
 * Node Handlers
 *
 * Central export for all node handler functionality.
 * Provides clean import path for handlers, registry, and types.
 *
 * @example
 * ```ts
 * import { handlerRegistry, NodeHandler } from '@/store/nodeHandlers';
 *
 * const handler = handlerRegistry.getHandler('extractText');
 * const result = await handler.process(node, inputs);
 * ```
 */

// Registry (singleton)
export { handlerRegistry, NodeHandlerRegistry } from "./registry";

// Handlers
export { AssetHandler } from "./assetHandler";
export { PdfNodesHandler } from "./pdfHandler";
export { ArtifactHandler } from "./artifactHandler";

// Types
export type {
  NodeHandler,
  NodeInput,
  NodeOutput,
  NodeProcessingResult,
  WorkflowNodeState,
  ProcessingMode,
  NodeHandlerMap,
  PdfExtractionInput,
  PdfExtractionOptions,
  PdfExtractionOutput,
  TextProcessingInput,
  TextProcessingOptions,
  TextProcessingOutput,
} from "./types";
