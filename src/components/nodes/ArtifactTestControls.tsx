"use client";

import { FileText, FileJson, Image as ImageIcon, File } from "lucide-react";

interface ArtifactOutput {
  type: "text" | "json" | "image" | "file";
  content: string;
  fileName?: string;
  size?: number;
}

interface ArtifactTestControlsProps {
  onTestOutput: (type: "text" | "json" | "image" | "file") => void;
}

/**
 * Temporary component for testing artifact output displays.
 * This component should be removed once actual workflow execution is implemented.
 */
export function ArtifactTestControls({ onTestOutput }: ArtifactTestControlsProps) {
  return (
    <div className="pt-2 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-2">Test output (temporary):</p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onTestOutput("text")}
          className="flex-1 p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          title="Test with text output"
        >
          <FileText className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onTestOutput("json")}
          className="flex-1 p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          title="Test with JSON output"
        >
          <FileJson className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => onTestOutput("image")}
          className="flex-1 p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          title="Test with image output"
        >
          <ImageIcon className="w-4 h-4 text-purple-600" />
        </button>
        <button
          onClick={() => onTestOutput("file")}
          className="flex-1 p-1.5 hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
          title="Test with file output"
        >
          <File className="w-4 h-4 text-orange-600" />
        </button>
      </div>
    </div>
  );
}

/**
 * Generates test output data for different file types.
 * This function should be removed along with ArtifactTestControls.
 */
export function generateTestOutput(testType: "text" | "json" | "image" | "file"): ArtifactOutput {
  const testOutputs: Record<typeof testType, ArtifactOutput> = {
    text: {
      type: "text",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      fileName: "output.txt",
      size: 234,
    },
    json: {
      type: "json",
      content: JSON.stringify(
        {
          status: "success",
          data: {
            items: [
              { id: 1, name: "Item A", value: 100 },
              { id: 2, name: "Item B", value: 250 },
            ],
            total: 350,
          },
        },
        null,
        2
      ),
      fileName: "output.json",
      size: 156,
    },
    image: {
      type: "image",
      content:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%2306b6d4'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3ETest Image%3C/text%3E%3C/svg%3E",
      fileName: "output.png",
      size: 1024,
    },
    file: {
      type: "file",
      content: "Binary file content placeholder",
      fileName: "document.pdf",
      size: 4096,
    },
  };

  return testOutputs[testType];
}
