import { NodeType } from "@/store/workflowStore";

/**
 * Base interface for tool items that can be dragged/clicked to add nodes
 */
export interface ToolItem {
  icon: React.ReactNode;
  label: string;
  description?: string;
  nodeType: NodeType;
}

/**
 * Discriminated union for section content items
 * Allows mixing different types of content within a single section
 */
export type SectionItem =
  | {
      type: "tool";
      data: ToolItem;
    }
  | {
      type: "component";
      component: React.ComponentType<any>;
      props?: Record<string, any>;
    }
  | {
      type: "group";
      label?: string;
      items: SectionItem[];
    };

/**
 * Configuration for a collapsible section in the right panel
 */
export interface ToolSection {
  title: string;
  items: SectionItem[];
  defaultOpen?: boolean;
}
