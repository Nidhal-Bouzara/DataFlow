import { WorkflowNode } from "../types/workflow";
import {
  NodeHandler,
  NodeInput,
  NodeOutput,
  NodeProcessingResult,
  ProcessingMode,
  PdfExtractionOptions,
  PdfExtractionOutput,
  TextProcessingOptions,
  TextProcessingOutput,
} from "./types";
import { filterInputsByType } from "../execution/inputCollector";

/**
 * PDF Nodes Handler
 *
 * Handles PDF extraction and text processing operations.
 * Orchestrates client-side preparation and API calls (stubbed for now).
 */
export class PdfNodesHandler implements NodeHandler {
  /**
   * Process a PDF-related node (extractText or processText)
   */
  async process(node: WorkflowNode, inputs: NodeInput[], mode: ProcessingMode = "parallel"): Promise<NodeProcessingResult> {
    const validation = this.validate(node);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    try {
      // Route to appropriate handler based on node type
      if (node.data.nodeType === "extractText") {
        return await this.extractText(node, inputs, mode);
      } else if (node.data.nodeType === "processText") {
        return await this.processText(node, inputs, mode);
      }

      return {
        success: false,
        error: `Unsupported node type: ${node.data.nodeType}`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Validate node configuration
   */
  validate(node: WorkflowNode): { valid: boolean; error?: string } {
    const { nodeType, config } = node.data;

    if (nodeType === "extractText") {
      // Validate extraction options
      const options = this.parseExtractionOptions(config);
      if (!options.fromPdf) {
        return {
          valid: false,
          error: "PDF extraction must have 'fromPdf' option enabled",
        };
      }
      return { valid: true };
    }

    if (nodeType === "processText") {
      // Validate processing options
      const options = this.parseProcessingOptions(config);
      if (options.aiProcessing && !options.aiInstructions) {
        return {
          valid: false,
          error: "AI processing requires aiInstructions",
        };
      }
      return { valid: true };
    }

    return { valid: true };
  }

  // ─────────────────────────────────────────────────
  // Extract Text from PDFs
  // ─────────────────────────────────────────────────

  /**
   * Extracts text from PDF files
   */
  private async extractText(node: WorkflowNode, inputs: NodeInput[], mode: ProcessingMode): Promise<NodeProcessingResult> {
    const options = this.parseExtractionOptions(node.data.config);
    const files = this.getFilesFromInputs(inputs);

    if (files.length === 0) {
      return {
        success: false,
        error: "No PDF files found in inputs",
      };
    }

    console.log(`[PdfHandler] Extracting text from ${files.length} file(s)...`);

    // Process files based on mode
    const outputs: PdfExtractionOutput[] = mode === "sequential" ? await this.extractSequential(files, options) : await this.extractParallel(files, options);

    const workflowState = {
      nodeId: node.id,
      timestamp: Date.now(),
      inputs,
      outputs: outputs as NodeOutput[],
      metadata: {
        fileCount: files.length,
        extractionMethod: options.useOcr ? "ocr" : "direct",
      },
    };

    return {
      success: true,
      outputs: outputs as NodeOutput[],
      workflowState,
    };
  }

  /**
   * Extract text from files in parallel
   */
  private async extractParallel(files: File[], options: PdfExtractionOptions): Promise<PdfExtractionOutput[]> {
    const promises = files.map((file) => this.extractFromFile(file, options));
    return Promise.all(promises);
  }

  /**
   * Extract text from files sequentially
   */
  private async extractSequential(files: File[], options: PdfExtractionOptions): Promise<PdfExtractionOutput[]> {
    const results: PdfExtractionOutput[] = [];
    for (const file of files) {
      const result = await this.extractFromFile(file, options);
      results.push(result);
    }
    return results;
  }

  /**
   * Extract text from a single file
   *
   * Future: Call /api/pdf/extract endpoint
   * For now: Stub with simulated extraction
   */
  private async extractFromFile(file: File, options: PdfExtractionOptions): Promise<PdfExtractionOutput> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Stub: Return mock extracted text
    const mockText =
      `[Extracted Text from ${file.name}]\n\n` +
      `This is simulated text extraction from the PDF file.\n` +
      `File size: ${(file.size / 1024).toFixed(2)} KB\n` +
      `Extraction method: ${options.useOcr ? "OCR" : "Direct"}`;

    return {
      type: "text",
      data: mockText,
      metadata: {
        fileName: file.name,
        extractionMethod: options.useOcr ? "ocr" : "direct",
      },
    };
  }

  // ─────────────────────────────────────────────────
  // Process Text
  // ─────────────────────────────────────────────────

  /**
   * Processes text inputs (merge, cleanup, AI)
   */
  private async processText(node: WorkflowNode, inputs: NodeInput[], _mode: ProcessingMode): Promise<NodeProcessingResult> {
    const options = this.parseProcessingOptions(node.data.config);
    const textInputs = filterInputsByType(inputs, "text");

    if (textInputs.length === 0) {
      return {
        success: false,
        error: "No text inputs found to process",
      };
    }

    console.log(`[PdfHandler] Processing ${textInputs.length} text input(s)...`);

    let processedText = "";
    let processingMethod: TextProcessingOutput["metadata"]["processingMethod"] = "merge";

    // Step 1: Merge inputs if enabled
    if (options.mergeInputs && textInputs.length > 1) {
      processedText = this.mergeTextInputs(textInputs);
      processingMethod = "merge";
    } else {
      processedText = String(textInputs[0].data);
    }

    // Step 2: Clean up text if enabled
    if (options.cleanUpText) {
      processedText = this.cleanUpText(processedText);
      processingMethod = "cleanup";
    }

    // Step 3: AI processing if enabled
    if (options.aiProcessing) {
      processedText = await this.processWithAI(processedText, options.aiInstructions || "");
      processingMethod = "ai";
    }

    const output: TextProcessingOutput = {
      type: "text",
      data: processedText,
      metadata: {
        inputCount: textInputs.length,
        processingMethod,
      },
    };

    const workflowState = {
      nodeId: node.id,
      timestamp: Date.now(),
      inputs,
      outputs: [output as NodeOutput],
      metadata: {
        processingMethod,
        inputCount: textInputs.length,
      },
    };

    return {
      success: true,
      outputs: [output as NodeOutput],
      workflowState,
    };
  }

  // ─────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────

  /**
   * Parse extraction options from node config
   */
  private parseExtractionOptions(config?: Record<string, unknown>): PdfExtractionOptions {
    const options = (config?.options as Array<{ key: string; enabled: boolean }>) || [];
    return {
      fromPdf: options.find((opt) => opt.key === "fromPdf")?.enabled ?? true,
      useOcr: options.find((opt) => opt.key === "useOcr")?.enabled ?? false,
    };
  }

  /**
   * Parse processing options from node config
   */
  private parseProcessingOptions(config?: Record<string, unknown>): TextProcessingOptions {
    const options = (config?.options as Array<{ key: string; enabled: boolean }>) || [];
    return {
      mergeInputs: options.find((opt) => opt.key === "mergeInputs")?.enabled ?? false,
      cleanUpText: options.find((opt) => opt.key === "cleanUpText")?.enabled ?? true,
      aiProcessing: options.find((opt) => opt.key === "aiProcessing")?.enabled ?? false,
      aiInstructions: (config?.aiInstructions as string) || undefined,
    };
  }

  /**
   * Get File objects from inputs
   */
  private getFilesFromInputs(inputs: NodeInput[]): File[] {
    const files: File[] = [];

    for (const input of inputs) {
      if (input.type === "file" && input.data instanceof File) {
        files.push(input.data);
      } else if (input.type === "files" && Array.isArray(input.data)) {
        files.push(...input.data.filter((f): f is File => f instanceof File));
      }
    }

    return files;
  }

  /**
   * Merge multiple text inputs into one
   */
  private mergeTextInputs(inputs: NodeInput[]): string {
    return inputs
      .map((input, index) => {
        const sourceLabel = input.metadata?.sourceLabel || input.sourceNodeId;
        return `--- Source ${index + 1}: ${sourceLabel} ---\n${String(input.data)}\n`;
      })
      .join("\n");
  }

  /**
   * Clean up text (remove extra whitespace, artifacts, etc.)
   */
  private cleanUpText(text: string): string {
    return text
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
      .replace(/[ \t]+/g, " ") // Collapse multiple spaces
      .trim();
  }

  /**
   * Process text with AI
   *
   * Future: Call /api/text/process endpoint
   * For now: Stub with simulated processing
   */
  private async processWithAI(text: string, instructions: string): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Stub: Return mock processed text
    return `[AI Processed]\n\n` + `Instructions: ${instructions}\n\n` + `Original text:\n${text.slice(0, 200)}${text.length > 200 ? "..." : ""}`;
  }
}
