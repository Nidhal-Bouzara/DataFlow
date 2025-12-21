import { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";
import { cn, generateUniqueId } from "@/lib/utils";
import { useFileUpload } from "../context";
import { FileStatus } from "../types";
import { motion } from "framer-motion";

export interface DropZoneProps {
  onFileSelect?: (files: File[]) => void;
  prompt?: string;
  maxSize?: number;
  maxCount?: number;
  multiple?: boolean;
  accept?: string;
  className?: string;
  onError?: (message: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelect: propOnFileSelect,
  prompt = "click or drop to upload file",
  maxSize: propMaxSize,
  multiple: propMultiple,
  accept: propAccept,
  className,
  onError: propOnError,
}) => {
  const {
    disabled,
    files: contextFiles,
    maxSize: contextMaxSize,
    multiple: contextMultiple,
    accept: contextAccept,
    setError: contextSetError,
    onFileSelect: contextOnFileSelect,
    onFileSelectChange: contextOnFileSelectChange,
    validateFiles: contextValidateFiles,
  } = useFileUpload();

  const maxSize = propMaxSize || contextMaxSize;
  const multiple = propMultiple !== undefined ? propMultiple : contextMultiple;
  const accept = propAccept || contextAccept;
  const onFileSelect = propOnFileSelect || contextOnFileSelect;
  const onError = propOnError || contextSetError;

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current && contextFiles.length === 0) {
      fileInputRef.current.value = "";
    }
  }, [contextFiles]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getFileInfos = (files: File[]) => {
    return files.map((file) => ({
      id: generateUniqueId(btoa(encodeURIComponent(file.name))),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      file: file,
      status: FileStatus.Pending,
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validation = contextValidateFiles(droppedFiles);

      if (!validation.valid) {
        if (onError && validation.errorMessage) {
          onError(validation.errorMessage);
        }
        return;
      }

      onFileSelect?.(droppedFiles);

      contextOnFileSelectChange?.(getFileInfos(droppedFiles));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validation = contextValidateFiles(selectedFiles);

      if (!validation.valid) {
        if (onError && validation.errorMessage) {
          onError(validation.errorMessage);
        }
        return;
      }

      onFileSelect?.(selectedFiles);

      contextOnFileSelectChange?.(getFileInfos(selectedFiles));
    }
  };

  return (
    <motion.div
      className={cn(
        "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors border-gray-200",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        "flex flex-col items-center justify-center gap-2",
        className
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Upload />
      <p className="text-sm text-muted-foreground">{prompt}</p>
      {maxSize && <p className="text-xs text-muted-foreground">file max can&apos;t exceed {maxSize}MB</p>}
      <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={handleFileInputChange} disabled={disabled} />
    </motion.div>
  );
};
