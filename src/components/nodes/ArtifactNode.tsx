"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Package } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { EditableNodeName } from "@/components/ui/EditableNodeName";
import { ArtifactOutputViewer, type ArtifactOutput } from "./ArtifactOutputViewer";
import { ArtifactTestControls, generateTestOutput } from "./ArtifactTestControls";

export function ArtifactNode({ id, data, ...props }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  // Get artifact name and output from config
  const artifactName = (data.config?.name as string) || "Unnamed Artifact";
  const output = data.config?.output as ArtifactOutput | null | undefined;

  // Handle name updates
  const handleNameChange = (newName: string) => {
    updateNodeData(id, {
      label: newName,
      config: {
        ...data.config,
        name: newName,
      },
    });
  };

  // Handle download
  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output.content], {
      type: output.type === "json" ? "application/json" : output.type === "image" ? "image/png" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = output.fileName || `${artifactName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle clearing output
  const handleClearOutput = () => {
    updateNodeData(id, {
      config: {
        ...data.config,
        output: null,
      },
    });
  };

  // Temporary test function - to be removed later
  const handleTestOutput = (testType: "text" | "json" | "image" | "file") => {
    const testOutput = generateTestOutput(testType);
    updateNodeData(id, {
      config: {
        ...data.config,
        output: testOutput,
      },
    });
  };

  const label = data.label || artifactName;
  const description = output ? "Output captured" : "Awaiting workflow execution";

  return (
    <BaseNode
      {...props}
      id={id}
      data={{ ...data, label, description }}
      icon={<Package className="w-5 h-5 text-cyan-600" />}
      bgColor="bg-white"
      borderColor="border-cyan-200"
      badgeLabel="Artifact"
      badgeColor="bg-cyan-100 text-cyan-600"
    >
      <div className="space-y-3">
        {/* Artifact Name Editor */}
        <EditableNodeName name={artifactName} onNameChange={handleNameChange} />

        {/* Output Content or Empty State */}
        {output ? (
          <ArtifactOutputViewer output={output} onDownload={handleDownload} onClear={handleClearOutput} />
        ) : (
          <div className="bg-cyan-50/50 rounded-lg p-4 border border-cyan-100 border-dashed">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <Package className="w-8 h-8 text-cyan-300" />
              <div>
                <p className="text-xs font-medium text-gray-600">No output yet</p>
                <p className="text-xs text-gray-500 mt-0.5">Output will appear here after workflow execution</p>
              </div>
            </div>
          </div>
        )}

        {/* Temporary Test Controls - Remove Later */}
        <ArtifactTestControls onTestOutput={handleTestOutput} />
      </div>
    </BaseNode>
  );
}
