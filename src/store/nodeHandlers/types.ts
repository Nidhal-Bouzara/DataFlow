import { WorkflowNode } from "../types/workflow";

/**
 * Input data passed to a node handler from predecessor nodes
 */
export interface NodeInput {
  /** ID of the source node that produced this input */
  sourceNodeId: string;

  /** Type of data being passed */
  type: "text" | "json" | "file" | "files" | "unknown";

  /** The actual data content */
  data: unknown;

  /** Optional metadata about the input */
  metadata?: Record<string, unknown>;
}

/**
 * Output data produced by a node handler
 */
export interface NodeOutput {
  /** Type of output produced */
  type: "text" | "json" | "file" | "files" | "error";

  /** The actual output data */
  data: unknown;

  /** Optional metadata about the output */
  metadata?: Record<string, unknown>;
}

/**
 * Result of processing a node with workflow state
 */
export interface NodeProcessingResult {
  /** Whether the node processed successfully */
  success: boolean;

  /** Error message if processing failed */
  error?: string;

  /** Output data from the node */
  outputs?: NodeOutput[];

  /** Updated workflow state for this node (for artifact display) */
  workflowState?: WorkflowNodeState;
}

/**
 * Workflow state snapshot for a specific node
 * Used by artifact nodes to display intermediate results
 */
export interface WorkflowNodeState {
  /** Node ID this state belongs to */
  nodeId: string;

  /** Timestamp when state was captured */
  timestamp: number;

  /** Collected outputs from all inputs */
  inputs: NodeInput[];

  /** Produced outputs */
  outputs: NodeOutput[];

  /** Additional metadata (e.g., processing time, token count) */
  metadata?: Record<string, unknown>;
}

/**
 * Processing mode for nodes
 */
export type ProcessingMode = "parallel" | "sequential";

/**
 * Node handler interface - processes nodes and produces outputs
 *
 * Handlers are responsible for:
 * - Validating node configuration
 * - Processing input data
 * - Calling API routes (future)
 * - Returning outputs and workflow state
 */
export interface NodeHandler {
  /**
   * Process a node with given inputs
   *
   * @param node - The workflow node to process
   * @param inputs - Input data from predecessor nodes
   * @param mode - Processing mode (parallel or sequential)
   * @returns Processing result with outputs and workflow state
   */
  process(node: WorkflowNode, inputs: NodeInput[], mode?: ProcessingMode): Promise<NodeProcessingResult>;

  /**
   * Validate node configuration
   *
   * @param node - The workflow node to validate
   * @returns True if valid, error message if invalid
   */
  validate(node: WorkflowNode): { valid: boolean; error?: string };
}

/**
 * Registry of node handlers by node type
 */
export type NodeHandlerMap = Map<string, NodeHandler>;

// ─────────────────────────────────────────────────
// PDF-Specific Types
// ─────────────────────────────────────────────────

/**
 * Input for PDF extraction handler
 */
export interface PdfExtractionInput extends NodeInput {
  type: "file" | "files";
  data: File | File[];
}

/**
 * Options for PDF text extraction
 */
export interface PdfExtractionOptions {
  /** Use OCR for scanned/image-based PDFs */
  useOcr: boolean;

  /** Extract from PDF files */
  fromPdf: boolean;
}

/**
 * Output from PDF extraction
 */
export interface PdfExtractionOutput extends NodeOutput {
  type: "text";
  data: string; // Extracted text content
  metadata: {
    fileName: string;
    pageCount?: number;
    extractionMethod: "direct" | "ocr";
  };
}

/**
 * Input for text processing handler
 */
export interface TextProcessingInput extends NodeInput {
  type: "text";
  data: string;
}

/**
 * Options for text processing
 */
export interface TextProcessingOptions {
  /** Merge multiple text inputs into one */
  mergeInputs: boolean;

  /** Clean up extraction artifacts */
  cleanUpText: boolean;

  /** Use AI to process text */
  aiProcessing: boolean;

  /** Custom AI instructions (when aiProcessing enabled) */
  aiInstructions?: string;
}

/**
 * Output from text processing
 */
export interface TextProcessingOutput extends NodeOutput {
  type: "text" | "json";
  data: string | object;
  metadata: {
    inputCount: number;
    processingMethod: "merge" | "cleanup" | "ai";
    tokenCount?: number;
  };
}
