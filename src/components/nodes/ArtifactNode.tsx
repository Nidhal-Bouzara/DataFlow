"use client";

import { NodeProps } from "@xyflow/react";
import { BaseNode } from "./BaseNode";
import { Package } from "lucide-react";
import { WorkflowNode, useWorkflowStore } from "@/store/workflowStore";
import { EditableNodeName } from "@/components/ui/EditableNodeName";
import { MultiOutputViewer, type ArtifactOutputCollection } from "./ArtifactOutputViewer";
import { ArtifactTestControls, generateTestOutput } from "./ArtifactTestControls";

export function ArtifactNode({ id, data, ...props }: NodeProps<WorkflowNode>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  // Get artifact name and outputs from config
  const artifactName = (data.config?.name as string) || "Unnamed Artifact";
  const outputs = (data.config?.outputs as ArtifactOutputCollection) || [];

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

  // Handle download single file
  const handleDownload = (index: number) => {
    const output = outputs[index];
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

  // Handle download all files
  const handleDownloadAll = () => {
    outputs.forEach((_, index) => handleDownload(index));
  };

  // Handle download selected files
  const handleDownloadSelected = (indices: number[]) => {
    indices.forEach((index) => handleDownload(index));
  };

  // Handle deleting single file
  const handleDelete = (index: number) => {
    const newOutputs = outputs.filter((_, i) => i !== index);
    updateNodeData(id, {
      config: {
        ...data.config,
        outputs: newOutputs,
      },
    });
  };

  // Handle deleting all files
  const handleDeleteAll = () => {
    updateNodeData(id, {
      config: {
        ...data.config,
        outputs: [],
      },
    });
  };

  // Handle deleting selected files
  const handleDeleteSelected = (indices: number[]) => {
    const newOutputs = outputs.filter((_, i) => !indices.includes(i));
    updateNodeData(id, {
      config: {
        ...data.config,
        outputs: newOutputs,
      },
    });
  };

  // Temporary test function - to be removed later
  const handleTestOutput = (testType: "text" | "json" | "image" | "file") => {
    const testOutput = generateTestOutput(testType, outputs.length);
    updateNodeData(id, {
      config: {
        ...data.config,
        outputs: [...outputs, testOutput],
      },
    });
  };

  const label = data.label || artifactName;
  const description = outputs.length > 0 ? `${outputs.length} file${outputs.length !== 1 ? "s" : ""} captured` : "Awaiting workflow execution";

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
      <div className="space-y-3 w-120 max-w-180">
        {/* Artifact Name Editor */}
        <EditableNodeName name={artifactName} onNameChange={handleNameChange} />

        {/* Output Content or Empty State */}
        {outputs.length > 0 ? (
          <MultiOutputViewer
            outputs={outputs}
            onDownload={handleDownload}
            onDownloadAll={handleDownloadAll}
            onDownloadSelected={handleDownloadSelected}
            onDelete={handleDelete}
            onDeleteAll={handleDeleteAll}
            onDeleteSelected={handleDeleteSelected}
          />
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
        <ArtifactTestControls onTestOutput={handleTestOutput} onClearAll={handleDeleteAll} />
      </div>
    </BaseNode>
  );
}
