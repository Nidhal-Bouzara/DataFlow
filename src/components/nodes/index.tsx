"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Database, Play, GitBranch } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";

export function AssetNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode {...props} icon={<Database className="w-8 h-8 text-blue-600" />} bgColor="bg-blue-50" borderColor="border-blue-200" />;
}

export function ActionNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode {...props} icon={<Play className="w-8 h-8 text-green-600" />} bgColor="bg-green-50" borderColor="border-green-200" />;
}

export function ConditionNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode {...props} icon={<GitBranch className="w-8 h-8 text-amber-600" />} bgColor="bg-amber-50" borderColor="border-amber-200" />;
}

export const nodeTypes = {
  asset: AssetNode,
  action: ActionNode,
  condition: ConditionNode,
};
