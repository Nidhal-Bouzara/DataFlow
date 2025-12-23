"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Type, HelpCircle } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { Toggle } from "@/components/ui/Toggle";
import { Tooltip } from "@/components/ui/Tooltip";

interface ProcessOption {
  key: "mergeInputs" | "cleanUpText" | "aiProcessing";
  enabled: boolean;
}

export function ProcessTextNode({ id, data, ...props }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  // Get options from config (array-based)
  const options = (data.config?.options as ProcessOption[]) ?? [
    { key: "mergeInputs", enabled: false },
    { key: "cleanUpText", enabled: false },
    { key: "aiProcessing", enabled: false },
  ];

  // Get AI instructions (persisted value)
  const aiInstructions = (data.config?.aiInstructions as string) ?? "";

  // Helper to find option state
  const getOptionState = (key: ProcessOption["key"]) => {
    return options.find((opt) => opt.key === key)?.enabled ?? false;
  };

  // Helper to toggle option
  const handleToggleOption = (key: ProcessOption["key"], checked: boolean) => {
    const newOptions = options.map((opt) => (opt.key === key ? { ...opt, enabled: checked } : opt));

    updateNodeData(id, {
      config: {
        ...data.config,
        options: newOptions,
      },
    });
  };

  // Handle AI instructions change
  const handleAIInstructionsChange = (value: string) => {
    updateNodeData(id, {
      config: {
        ...data.config,
        aiInstructions: value,
      },
    });
  };

  // Determine dynamic label based on enabled options
  const enabledOptions = options.filter((opt) => opt.enabled);
  const label = enabledOptions.length > 0 ? `Process Text (${enabledOptions.length})` : "Process Text";

  const description = "Transform and process text content";

  return (
    <BaseNode
      {...props}
      id={id}
      data={{ ...data, label, description }}
      icon={<Type className="w-5 h-5 text-emerald-600" />}
      bgColor="bg-white"
      borderColor="border-emerald-200"
      badgeLabel="Text Process"
      badgeColor="bg-emerald-100 text-emerald-600"
    >
      {/* Process Options */}
      <div className="space-y-3">
        {/* Option 1: Merge Inputs */}
        <div className="flex items-center gap-2">
          <Toggle id={`merge-inputs-${id}`} checked={getOptionState("mergeInputs")} onChange={(checked) => handleToggleOption("mergeInputs", checked)} />
          <label htmlFor={`merge-inputs-${id}`} className="text-xs text-gray-700 cursor-pointer flex-1">
            Merge inputs
          </label>
          <Tooltip content="Merges all incoming inputs into a single artifact, combining multiple text sources into one unified output." side="top">
            <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about merging inputs">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </Tooltip>
        </div>

        {/* Option 2: Clean Up Text */}
        <div className="flex items-center gap-2">
          <Toggle id={`clean-up-text-${id}`} checked={getOptionState("cleanUpText")} onChange={(checked) => handleToggleOption("cleanUpText", checked)} />
          <label htmlFor={`clean-up-text-${id}`} className="text-xs text-gray-700 cursor-pointer flex-1">
            Clean up text
          </label>
          <Tooltip content="Removes unwanted characters, extra whitespace, and irregular spacing often left over by PDF text extraction." side="top">
            <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about cleaning up text">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </Tooltip>
        </div>

        {/* Option 3: AI Processing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Toggle id={`ai-processing-${id}`} checked={getOptionState("aiProcessing")} onChange={(checked) => handleToggleOption("aiProcessing", checked)} />
            <label htmlFor={`ai-processing-${id}`} className="text-xs text-gray-700 cursor-pointer flex-1">
              AI processing
            </label>
            <Tooltip content="Use AI to process text based on custom instructions. Provide detailed instructions in the text area below." side="top">
              <span className="shrink-0 cursor-help text-gray-400 hover:text-gray-600 transition-colors" aria-label="Help information about AI processing">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            </Tooltip>
          </div>

          {/* AI Instructions Textarea - Conditionally shown */}
          {getOptionState("aiProcessing") && (
            <textarea
              value={aiInstructions}
              onChange={(e) => handleAIInstructionsChange(e.target.value)}
              placeholder="Enter AI processing instructions..."
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
            />
          )}
        </div>
      </div>
    </BaseNode>
  );
}
