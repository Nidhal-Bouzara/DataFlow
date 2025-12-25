import { Edge, Node } from "@xyflow/react";
import { WorkflowTemplate } from "@/types/workflows";

// Helper to create nodes easily
const createNode = (id: string, type: string, label: string, x: number, y: number, data: any = {}) => ({
  id,
  type,
  position: { x, y },
  data: { label, nodeType: type, ...data },
});

const createEdge = (id: string, source: string, target: string) => ({
  id,
  source,
  target,
  type: "dataFlow",
  animated: true,
});

// Mock Data
export const mockWorkflows: WorkflowTemplate[] = [
  {
    id: "wf-1",
    title: "Invoice Extraction Pipeline",
    description: "Automatically extract data from PDF invoices and export to CSV.",
    category: "document-processing",
    usageCount: 1250,
    isFeatured: true,
    difficulty: "Intermediate",
    author: "DataFlow Team",
    nodes: [
      createNode("1", "asset", "Invoice PDF", 50, 50, { description: "Input PDF files" }),
      createNode("2", "extractText", "OCR Extraction", 50, 200, { description: "Extract text from PDF" }),
      createNode("3", "processText", "Parse Fields", 50, 350, { description: "Identify invoice fields" }),
      createNode("4", "artifact", "CSV Export", 50, 500, { description: "Final data output" }),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3"), createEdge("e3-4", "3", "4")],
  },
  {
    id: "wf-2",
    title: "Resume Screener",
    description: "Filter resumes based on keywords and skills matching.",
    category: "ai-powered",
    usageCount: 890,
    isFeatured: true,
    difficulty: "Advanced",
    author: "HR Tech",
    nodes: [
      createNode("1", "assetStack", "Resume Batch", 100, 50, { description: "Folder of resumes" }),
      createNode("2", "extractText", "Text Extraction", 100, 200, { description: "Convert to text" }),
      createNode("3", "condition", "Keyword Match", 100, 350, { description: "Filter by skills" }),
      createNode("4", "action", "Email Candidate", 250, 500, { description: "Send interview invite" }),
      createNode("5", "artifact", "Reject List", -50, 500, { description: "Log rejected candidates" }),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3"), createEdge("e3-4", "3", "4"), createEdge("e3-5", "3", "5")],
  },
  {
    id: "wf-3",
    title: "Social Media Sentiment",
    description: "Analyze sentiment of social media posts and generate reports.",
    category: "data-extraction",
    usageCount: 640,
    isFeatured: false,
    difficulty: "Beginner",
    author: "Marketing Pro",
    nodes: [
      createNode("1", "asset", "Twitter Data", 0, 50, { description: "JSON export" }),
      createNode("2", "processText", "Sentiment Analysis", 0, 200, { description: "AI analysis" }),
      createNode("3", "artifact", "Report Dashboard", 0, 350, { description: "Visual report" }),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3")],
  },
  {
    id: "wf-4",
    title: "Legal Contract Review",
    description: "Highlight risky clauses in legal contracts automatically.",
    category: "ai-powered",
    usageCount: 420,
    isFeatured: false,
    difficulty: "Advanced",
    author: "LegalAI",
    nodes: [
      createNode("1", "asset", "Contract PDF", 50, 50),
      createNode("2", "extractText", "Full Text", 50, 200),
      createNode("3", "processText", "Clause Detection", 50, 350),
      createNode("4", "condition", "Risk Check", 50, 500),
      createNode("5", "artifact", "Risk Report", 50, 650),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3"), createEdge("e3-4", "3", "4"), createEdge("e4-5", "4", "5")],
  },
  {
    id: "wf-5",
    title: "Image Tagging Pipeline",
    description: "Auto-tag images using computer vision and organize into folders.",
    category: "automation",
    usageCount: 310,
    isFeatured: false,
    difficulty: "Intermediate",
    author: "VisionOps",
    nodes: [
      createNode("1", "assetStack", "Image Folder", 100, 50),
      createNode("2", "action", "Generate Tags", 100, 200),
      createNode("3", "processText", "Sort Tags", 100, 350),
      createNode("4", "artifact", "Organized JSON", 100, 500),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3"), createEdge("e3-4", "3", "4")],
  },
  {
    id: "wf-6",
    title: "Customer Support Router",
    description: "Route support tickets to the right department based on content.",
    category: "automation",
    usageCount: 1500,
    isFeatured: true,
    difficulty: "Beginner",
    author: "SupportHero",
    nodes: [
      createNode("1", "asset", "Ticket Stream", 150, 50),
      createNode("2", "processText", "Classify Topic", 150, 200),
      createNode("3", "condition", "Department?", 150, 350),
      createNode("4", "action", "Assign Tech", 0, 500),
      createNode("5", "action", "Assign Billing", 150, 500),
      createNode("6", "action", "Assign Sales", 300, 500),
    ],
    edges: [createEdge("e1-2", "1", "2"), createEdge("e2-3", "2", "3"), createEdge("e3-4", "3", "4"), createEdge("e3-5", "3", "5"), createEdge("e3-6", "3", "6")],
  },
];
