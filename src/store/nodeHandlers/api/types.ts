/**
 * API Type Definitions
 *
 * Defines request/response interfaces for backend API routes.
 * These establish the contract between client-side handlers and
 * future server-side implementations.
 *
 * Current status: STUB - APIs not yet implemented
 * Handlers currently simulate responses locally
 */

// ─────────────────────────────────────────────────
// PDF Extraction API
// ─────────────────────────────────────────────────

/**
 * Request to extract text from PDF
 *
 * Endpoint: POST /api/pdf/extract
 */
export interface PdfExtractionRequest {
  /** Base64-encoded PDF file or file URL */
  file: string | { url: string };

  /** Extraction options */
  options: {
    /** Use OCR for scanned documents */
    useOcr: boolean;

    /** Page range to extract (optional) */
    pages?: {
      start?: number;
      end?: number;
    };
  };

  /** Optional metadata */
  metadata?: {
    fileName: string;
    fileSize: number;
  };
}

/**
 * Response from PDF extraction
 */
export interface PdfExtractionResponse {
  /** Success status */
  success: boolean;

  /** Extracted text content */
  text?: string;

  /** Error message if failed */
  error?: string;

  /** Extraction metadata */
  metadata?: {
    pageCount: number;
    extractionMethod: "direct" | "ocr";
    processingTimeMs: number;
  };
}

// ─────────────────────────────────────────────────
// Text Processing API
// ─────────────────────────────────────────────────

/**
 * Request to process text
 *
 * Endpoint: POST /api/text/process
 */
export interface TextProcessingRequest {
  /** Input text to process */
  text: string;

  /** Processing operations */
  operations: {
    /** Clean up text artifacts */
    cleanUp?: boolean;

    /** AI processing with custom instructions */
    ai?: {
      enabled: boolean;
      instructions: string;
      model?: string;
    };
  };

  /** Optional metadata */
  metadata?: {
    sourceNodeId?: string;
    inputLength?: number;
  };
}

/**
 * Response from text processing
 */
export interface TextProcessingResponse {
  /** Success status */
  success: boolean;

  /** Processed text or structured data */
  result?: string | object;

  /** Error message if failed */
  error?: string;

  /** Processing metadata */
  metadata?: {
    inputTokens?: number;
    outputTokens?: number;
    processingTimeMs: number;
    model?: string;
  };
}

// ─────────────────────────────────────────────────
// Batch Processing (Future)
// ─────────────────────────────────────────────────

/**
 * Request to process multiple files in batch
 *
 * Endpoint: POST /api/batch/process (future)
 */
export interface BatchProcessingRequest {
  /** Array of files to process */
  files: Array<{
    id: string;
    url: string;
    type: "pdf" | "image" | "text";
  }>;

  /** Processing pipeline */
  pipeline: Array<{
    operation: "extract" | "process" | "transform";
    options: Record<string, unknown>;
  }>;

  /** Processing mode */
  mode: "parallel" | "sequential";
}

/**
 * Response from batch processing
 */
export interface BatchProcessingResponse {
  /** Success status */
  success: boolean;

  /** Results for each file */
  results: Array<{
    fileId: string;
    success: boolean;
    data?: unknown;
    error?: string;
  }>;

  /** Overall metadata */
  metadata: {
    totalFiles: number;
    successCount: number;
    failureCount: number;
    processingTimeMs: number;
  };
}

// ─────────────────────────────────────────────────
// Error Types
// ─────────────────────────────────────────────────

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Common error codes
 */
export enum ApiErrorCode {
  INVALID_REQUEST = "INVALID_REQUEST",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  UNSUPPORTED_FORMAT = "UNSUPPORTED_FORMAT",
  EXTRACTION_FAILED = "EXTRACTION_FAILED",
  PROCESSING_FAILED = "PROCESSING_FAILED",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  SERVER_ERROR = "SERVER_ERROR",
}
