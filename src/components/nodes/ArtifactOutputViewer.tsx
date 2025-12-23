"use client";

import { FileText, Image as ImageIcon, FileJson, File, Download, Trash2, AlertTriangle, CheckSquare, Square } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ArtifactOutput {
  type: "text" | "json" | "image" | "file";
  content: string;
  fileName?: string;
  size?: number;
}

export type ArtifactOutputCollection = ArtifactOutput[];

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

// Multi-Output Viewer Interfaces
interface MultiOutputViewerProps {
  outputs: ArtifactOutput[];
  onDownload: (index: number) => void;
  onDownloadAll: () => void;
  onDownloadSelected: (indices: number[]) => void;
  onDelete: (index: number) => void;
  onDeleteAll: () => void;
  onDeleteSelected: (indices: number[]) => void;
}

function FileItem({
  output,
  index,
  isSelected,
  onSelect,
  onDownload,
  onDelete,
  isPreview,
}: {
  output: ArtifactOutput;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  onDownload: (index: number) => void;
  onDelete: (index: number) => void;
  isPreview?: boolean;
}) {
  const getIconComponent = () => {
    switch (output.type) {
      case "text":
        return <FileText className="w-4 h-4 text-gray-600" />;
      case "json":
        return <FileJson className="w-4 h-4 text-blue-600" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      case "file":
        return <File className="w-4 h-4 text-orange-600" />;
    }
  };

  const getThumbnail = () => {
    if (output.type === "image") {
      return (
        <div className="w-full h-20 bg-gray-50 rounded border border-gray-200 overflow-hidden flex items-center justify-center">
          <Image src={output.content} alt={output.fileName || "Preview"} className="max-h-full max-w-full object-contain" width={80} height={80} unoptimized />
        </div>
      );
    }
    return <div className="w-full h-20 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">{getIconComponent()}</div>;
  };

  if (output.type === "image" && !isPreview) {
    // Grid layout for images
    return (
      <div className="relative group">
        <div className="cursor-pointer" onClick={() => onSelect(index)}>
          {getThumbnail()}
          <div className="mt-1 px-1">
            <p className="text-xs text-gray-700 truncate font-medium">{output.fileName || `output_${index + 1}`}</p>
            <p className="text-xs text-gray-500">{formatSize(output.size || 0)}</p>
          </div>
        </div>

        {/* Selection Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          className="absolute top-1 left-1 p-0.5 bg-white rounded shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-gray-400" />}
        </button>

        {/* Action Buttons */}
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDownload(index)} className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 transition-colors" title="Download">
            <Download className="w-3 h-3 text-cyan-600" />
          </button>
          <button onClick={() => onDelete(index)} className="p-1 bg-white rounded shadow-sm hover:bg-gray-50 transition-colors" title="Delete">
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>
    );
  }

  // List layout for documents
  return (
    <div className={`flex items-center gap-2 p-2 rounded border transition-colors ${isSelected ? "bg-cyan-50 border-cyan-200" : "bg-gray-50 border-gray-200 hover:bg-gray-100"}`}>
      <button onClick={() => onSelect(index)} className="shrink-0">
        {isSelected ? <CheckSquare className="w-4 h-4 text-cyan-600" /> : <Square className="w-4 h-4 text-gray-400" />}
      </button>

      <div className="shrink-0">{getIconComponent()}</div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(index)}>
        <p className="text-xs font-medium text-gray-700 truncate">{output.fileName || `output_${index + 1}.${output.type}`}</p>
        <p className="text-xs text-gray-500">{formatSize(output.size || 0)}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onDownload(index)} className="p-1 hover:bg-white rounded transition-colors" title="Download">
          <Download className="w-3.5 h-3.5 text-cyan-600" />
        </button>
        <button onClick={() => onDelete(index)} className="p-1 hover:bg-white rounded transition-colors" title="Delete">
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    </div>
  );
}

export function MultiOutputViewer({ outputs, onDownload, onDownloadAll, onDownloadSelected, onDelete, onDeleteAll, onDeleteSelected }: MultiOutputViewerProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const hasImages = outputs.some((o) => o.type === "image");
  const hasDocuments = outputs.some((o) => o.type !== "image");
  const showWarning = outputs.length >= 20;

  const toggleSelection = (index: number) => {
    const newSelection = new Set(selectedIndices);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedIndices(newSelection);
    setPreviewIndex(index);
  };

  const selectAll = () => {
    setSelectedIndices(new Set(outputs.map((_, i) => i)));
  };

  const deselectAll = () => {
    setSelectedIndices(new Set());
  };

  const handleDownloadSelected = () => {
    onDownloadSelected(Array.from(selectedIndices));
  };

  const handleDeleteSelected = () => {
    onDeleteSelected(Array.from(selectedIndices));
    setSelectedIndices(new Set());
    setPreviewIndex(null);
  };

  const imageOutputs = outputs.map((o, i) => ({ output: o, index: i })).filter((item) => item.output.type === "image");
  const documentOutputs = outputs.map((o, i) => ({ output: o, index: i })).filter((item) => item.output.type !== "image");

  return (
    <div className="space-y-3">
      {/* Warning for many files */}
      {showWarning && (
        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800">Large number of files ({outputs.length}). Consider reviewing and cleaning up unused outputs.</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">
            {outputs.length} file{outputs.length !== 1 ? "s" : ""}
          </span>
          {selectedIndices.size > 0 && <span className="text-xs text-cyan-600">({selectedIndices.size} selected)</span>}
        </div>

        <div className="flex items-center gap-1">
          {selectedIndices.size > 0 ? (
            <>
              <button onClick={deselectAll} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Deselect
              </button>
              <button onClick={handleDownloadSelected} className="px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded transition-colors" title="Download selected">
                Download ({selectedIndices.size})
              </button>
              <button onClick={handleDeleteSelected} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete selected">
                Delete ({selectedIndices.size})
              </button>
            </>
          ) : (
            <>
              <button onClick={selectAll} className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Select All
              </button>
              <button onClick={onDownloadAll} className="px-2 py-1 text-xs text-cyan-600 hover:bg-cyan-50 rounded transition-colors" title="Download all">
                Download All
              </button>
              <button onClick={onDeleteAll} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete all">
                Delete All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Files Display */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {/* Images Grid */}
        {hasImages && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Images ({imageOutputs.length})</h4>
            <div className="grid grid-cols-3 gap-2">
              {imageOutputs.map(({ output, index }) => (
                <FileItem
                  key={index}
                  output={output}
                  index={index}
                  isSelected={selectedIndices.has(index)}
                  onSelect={toggleSelection}
                  onDownload={onDownload}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Documents List */}
        {hasDocuments && (
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Documents ({documentOutputs.length})</h4>
            <div className="space-y-1">
              {documentOutputs.map(({ output, index }) => (
                <FileItem
                  key={index}
                  output={output}
                  index={index}
                  isSelected={selectedIndices.has(index)}
                  onSelect={toggleSelection}
                  onDownload={onDownload}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {previewIndex !== null && outputs[previewIndex] && (
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-600">Preview: {outputs[previewIndex].fileName || `output_${previewIndex + 1}`}</h4>
            <button onClick={() => setPreviewIndex(null)} className="text-xs text-gray-500 hover:text-gray-700">
              Close
            </button>
          </div>
          <OutputContentRenderer output={outputs[previewIndex]} />
        </div>
      )}
    </div>
  );
}
