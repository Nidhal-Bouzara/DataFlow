import { NodeType } from "../types/workflow";
import { NodeHandler, NodeHandlerMap } from "./types";
import { AssetHandler } from "./assetHandler";
import { PdfNodesHandler } from "./pdfHandler";
import { ArtifactHandler } from "./artifactHandler";

/**
 * Node Handler Registry
 *
 * Central registry that maps node types to their handlers.
 * Allows registration of custom handlers and extensibility.
 */
export class NodeHandlerRegistry {
  private handlers: NodeHandlerMap;

  constructor() {
    this.handlers = new Map();
    this.registerDefaultHandlers();
  }

  /**
   * Register default handlers for built-in node types
   */
  private registerDefaultHandlers(): void {
    const assetHandler = new AssetHandler();
    const pdfHandler = new PdfNodesHandler();
    const artifactHandler = new ArtifactHandler();

    // Asset nodes - data sources
    this.register("asset", assetHandler);
    this.register("assetStack", assetHandler);

    // PDF processing nodes
    this.register("extractText", pdfHandler);
    this.register("processText", pdfHandler);

    // Artifact nodes - visualization/output
    this.register("artifact", artifactHandler);

    // Note: action, condition nodes not yet implemented
    // They will be registered in future iterations
  }

  /**
   * Register a handler for a node type
   *
   * @param nodeType - The node type to handle
   * @param handler - Handler instance
   */
  register(nodeType: NodeType, handler: NodeHandler): void {
    this.handlers.set(nodeType, handler);
    console.log(`[Registry] Registered handler for: ${nodeType}`);
  }

  /**
   * Get handler for a node type
   *
   * @param nodeType - The node type
   * @returns Handler if registered, undefined otherwise
   */
  getHandler(nodeType: NodeType): NodeHandler | undefined {
    return this.handlers.get(nodeType);
  }

  /**
   * Check if a handler is registered for a node type
   *
   * @param nodeType - The node type
   * @returns True if handler is registered
   */
  hasHandler(nodeType: NodeType): boolean {
    return this.handlers.has(nodeType);
  }

  /**
   * Get all registered node types
   *
   * @returns Array of node types with handlers
   */
  getRegisteredTypes(): NodeType[] {
    return Array.from(this.handlers.keys()) as NodeType[];
  }

  /**
   * Unregister a handler (useful for testing)
   *
   * @param nodeType - The node type to unregister
   */
  unregister(nodeType: NodeType): void {
    this.handlers.delete(nodeType);
    console.log(`[Registry] Unregistered handler for: ${nodeType}`);
  }

  /**
   * Clear all handlers (useful for testing)
   */
  clear(): void {
    this.handlers.clear();
    console.log("[Registry] Cleared all handlers");
  }
}

/**
 * Singleton instance of the registry
 */
export const handlerRegistry = new NodeHandlerRegistry();
