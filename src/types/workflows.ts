import { Edge, Node } from "@xyflow/react";

export type WorkflowCategory = "document-processing" | "data-extraction" | "automation" | "ai-powered";

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  nodes: Node[];
  edges: Edge[];
  usageCount: number;
  isFeatured: boolean;
  author?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export interface WorkflowFilter {
  category?: WorkflowCategory | "all";
  search?: string;
}
