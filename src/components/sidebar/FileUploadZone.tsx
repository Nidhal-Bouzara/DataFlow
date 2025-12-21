"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, Plus, X, FileIcon } from "lucide-react";
import { useWorkflowStore, FileAsset } from "@/store/workflowStore";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 3;

interface UploadedFile {
  id: string;
  file: File;
}

export function FileUploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFileAssetNode = useWorkflowStore((state) => state.addFileAssetNode);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      setError(null);
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > MAX_FILE_SIZE) {
          setError(`File "${file.name}" exceeds 10MB limit`);
          continue;
        }

        if (uploadedFiles.length + newFiles.length >= MAX_FILES) {
          setError(`Maximum ${MAX_FILES} files allowed`);
          break;
        }

        newFiles.push({
          id: `${Date.now()}-${i}`,
          file,
        });
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
    },
    [uploadedFiles.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    setError(null);
  };

  const addFileToCanvas = (uploadedFile: UploadedFile) => {
    const fileAsset: FileAsset = {
      name: uploadedFile.file.name,
      size: uploadedFile.file.size,
      type: uploadedFile.file.type,
    };

    // Calculate position based on existing nodes
    const baseX = 300;
    const baseY = 100 + uploadedFiles.indexOf(uploadedFile) * 150;

    addFileAssetNode(fileAsset, { x: baseX, y: baseY });
    removeFile(uploadedFile.id);
  };

  const addAllFilesToCanvas = () => {
    uploadedFiles.forEach((uploadedFile, index) => {
      const fileAsset: FileAsset = {
        name: uploadedFile.file.name,
        size: uploadedFile.file.size,
        type: uploadedFile.file.type,
      };
      addFileAssetNode(fileAsset, { x: 300, y: 100 + index * 150 });
    });
    setUploadedFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="p-4 border-b border-gray-100">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer",
          "bg-neutral-900 border-neutral-600",
          isDragging && "border-blue-500 bg-neutral-800",
          "hover:border-neutral-500 hover:bg-neutral-800"
        )}
      >
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} accept="*/*" />
        <div className="flex flex-col items-center gap-3 text-center">
          <Upload className="w-8 h-8 text-neutral-400" />
          <div>
            <p className="text-sm text-neutral-300">click or drop, {MAX_FILES} file to upload</p>
            <p className="text-xs text-neutral-500 mt-1">file max can&apos;t exceed 10MB</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <div key={uploadedFile.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
              <FileIcon className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{uploadedFile.file.name}</p>
                <p className="text-xs text-gray-500">{formatSize(uploadedFile.file.size)}</p>
              </div>
              <button onClick={() => addFileToCanvas(uploadedFile)} className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors" title="Add to canvas">
                <Plus className="w-4 h-4" />
              </button>
              <button onClick={() => removeFile(uploadedFile.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {uploadedFiles.length > 1 && (
            <button onClick={addAllFilesToCanvas} className="w-full py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Add all {uploadedFiles.length} files to canvas
            </button>
          )}
        </div>
      )}
    </div>
  );
}
