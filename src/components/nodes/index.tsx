"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Database, Play, GitBranch, Globe, Smartphone, Mail, CheckSquare } from "lucide-react";
import { WorkflowNode } from "@/store/workflowStore";
import { StackedAssetNode } from "./StackedAssetNode";

export function AssetNode(props: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      {...props}
      icon={<Database className="w-5 h-5 text-blue-600" />}
      bgColor="bg-white"
      borderColor="border-gray-200"
      badgeLabel="Trigger"
      badgeColor="bg-green-100 text-green-600"
    />
  );
}

export function ActionNode(props: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      {...props}
      icon={<Mail className="w-5 h-5 text-gray-600" />}
      bgColor="bg-white"
      borderColor="border-gray-200"
      badgeLabel="Action"
      badgeColor="bg-red-100 text-red-500"
    />
  );
}

export function ConditionNode(props: NodeProps<WorkflowNode>) {
  return (
    <BaseNode
      {...props}
      icon={<CheckSquare className="w-5 h-5 text-green-600" />}
      bgColor="bg-white"
      borderColor="border-gray-200"
      badgeLabel="Check if/else"
      badgeColor="bg-orange-100 text-orange-500"
    />
  );
}

export const nodeTypes = {
  asset: AssetNode,
  assetStack: StackedAssetNode,
  action: ActionNode,
  condition: ConditionNode,
};
