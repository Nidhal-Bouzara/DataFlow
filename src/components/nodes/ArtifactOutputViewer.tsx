"use client";

import { FileText, Image as ImageIcon, FileJson, File, Download, Trash2 } from "lucide-react";
import Image from "next/image";

export interface ArtifactOutput {
  type: "text" | "json" | "image" | "file";
  content: string;
  fileName?: string;
  size?: number;
}

interface ArtifactOutputViewerProps {
  output: ArtifactOutput;
  onDownload: () => void;
  onClear: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function OutputIcon({ type }: { type: ArtifactOutput["type"] }) {
  switch (type) {
    case "text":
      return <FileText className="w-3 h-3 text-gray-500" />;
    case "json":
      return <FileJson className="w-3 h-3 text-gray-500" />;
    case "image":
      return <ImageIcon className="w-3 h-3 text-gray-500" />;
    case "file":
      return <File className="w-3 h-3 text-gray-500" />;
    default:
      return null;
  }
}

function TextOutputRenderer({ content }: { content: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">{content}</pre>
    </div>
  );
}

function JsonOutputRenderer({ content }: { content: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">{content}</pre>
    </div>
  );
}

function ImageOutputRenderer({ content }: { content: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
      <Image src={content} alt="Output preview" className="max-h-32 max-w-full rounded" width={200} height={100} unoptimized />
    </div>
  );
}

function FileOutputRenderer({ fileName, size }: { fileName?: string; size?: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2">
        <File className="w-4 h-4 text-gray-500" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{formatSize(size || 0)}</p>
        </div>
      </div>
    </div>
  );
}

function OutputContentRenderer({ output }: { output: ArtifactOutput }) {
  switch (output.type) {
    case "text":
      return <TextOutputRenderer content={output.content} />;
    case "json":
      return <JsonOutputRenderer content={output.content} />;
    case "image":
      return <ImageOutputRenderer content={output.content} />;
    case "file":
      return <FileOutputRenderer fileName={output.fileName} size={output.size} />;
    default:
      return null;
  }
}

export function ArtifactOutputViewer({ output, onDownload, onClear }: ArtifactOutputViewerProps) {
  return (
    <div className="space-y-2">
      {/* Output Type Indicator and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <OutputIcon type={output.type} />
          <span className="capitalize">{output.type}</span>
          {output.size && <span className="text-gray-400">• {formatSize(output.size)}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onDownload} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Download output">
            <Download className="w-3.5 h-3.5 text-cyan-600" />
          </button>
          <button onClick={onClear} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Clear output">
            <Trash2 className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Rendered Output Content */}
      <OutputContentRenderer output={output} />
    </div>
  );
}
