import { WorkflowNode, FileAsset } from "@/store/workflowStore";
import { Edge } from "@xyflow/react";
import { generateUniqueId } from "@/lib/utils";

// Define PDF files from temp/commerce directory
export const commercePDFFiles: FileAsset[] = [
  {
    name: "moj_commerce_decret.pdf",
    size: 524288, // ~512 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_decret2.pdf",
    size: 460800, // ~450 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_decret3.pdf",
    size: 491520, // ~480 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_loi.pdf",
    size: 614400, // ~600 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_loi2.pdf",
    size: 563200, // ~550 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_loi3.pdf",
    size: 532480, // ~520 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_loisetordonnances .pdf",
    size: 716800, // ~700 KB
    type: "application/pdf",
  },
  {
    name: "moj_commerce_ordonnance.pdf",
    size: 409600, // ~400 KB
    type: "application/pdf",
  },
];

// Calculate total size
const totalSize = commercePDFFiles.reduce((acc, file) => acc + file.size, 0);

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Generate unique IDs for nodes
const assetStackId = generateUniqueId("assetStack");
const extractTextId = generateUniqueId("extractText");
const artifact1Id = generateUniqueId("artifact");
const processTextId = generateUniqueId("processText");
const artifact2Id = generateUniqueId("artifact");

// Define initial nodes for the workflow
export const initialNodes: WorkflowNode[] = [
  // Node 1: Stacked Asset Node (Commerce PDFs)
  {
    id: assetStackId,
    type: "assetStack",
    position: { x: 400, y: 0 },
    dragHandle: ".drag-handle",
    data: {
      label: `${commercePDFFiles.length} files`,
      description: formatFileSize(totalSize),
      nodeType: "assetStack",
      files: commercePDFFiles,
    },
  },

  // Node 2: Extract Text Node
  {
    id: extractTextId,
    type: "extractText",
    position: { x: 400, y: 400 },
    dragHandle: ".drag-handle",
    data: {
      label: "Extract Text",
      description: "Extract text content from documents",
      nodeType: "extractText",
      config: {
        options: [
          { key: "fromPdf", enabled: true },
          { key: "useOcr", enabled: true },
        ],
      },
    },
  },

  // Node 3: Raw Text Artifact
  {
    id: artifact1Id,
    type: "artifact",
    position: { x: 400, y: 600 },
    dragHandle: ".drag-handle",
    data: {
      label: "Raw Extracted Text",
      description: "Awaiting workflow execution",
      nodeType: "artifact",
      config: {
        name: "Raw Extracted Text",
        outputs: [],
      },
    },
  },

  // Node 4: Process Text Node
  {
    id: processTextId,
    type: "processText",
    position: { x: 400, y: 1000 },
    dragHandle: ".drag-handle",
    data: {
      label: "Process Text",
      description: "Transform and process text content",
      nodeType: "processText",
      config: {
        options: [
          { key: "mergeInputs", enabled: false },
          { key: "cleanUpText", enabled: true },
          { key: "aiProcessing", enabled: false },
        ],
        aiInstructions: "",
      },
    },
  },

  // Node 5: Processed Text Artifact
  {
    id: artifact2Id,
    type: "artifact",
    position: { x: 400, y: 1250 },
    dragHandle: ".drag-handle",
    data: {
      label: "Processed Text",
      description: "Awaiting workflow execution",
      nodeType: "artifact",
      config: {
        name: "Processed Text",
        outputs: [],
      },
    },
  },
];

// Define initial edges connecting the nodes
export const initialEdges: Edge[] = [
  // Edge 1: Asset Stack → Extract Text
  {
    id: `${assetStackId}-${extractTextId}`,
    source: assetStackId,
    target: extractTextId,
    type: "dataFlow",
  },

  // Edge 2: Extract Text → Raw Text Artifact
  {
    id: `${extractTextId}-${artifact1Id}`,
    source: extractTextId,
    target: artifact1Id,
    type: "dataFlow",
  },

  // Edge 3: Raw Text Artifact → Process Text
  {
    id: `${artifact1Id}-${processTextId}`,
    source: artifact1Id,
    target: processTextId,
    type: "dataFlow",
  },

  // Edge 4: Process Text → Processed Text Artifact
  {
    id: `${processTextId}-${artifact2Id}`,
    source: processTextId,
    target: artifact2Id,
    type: "dataFlow",
  },
];
