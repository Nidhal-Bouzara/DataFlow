import { cn } from "@/lib/utils";
import { FileUploadProvider, type FileUploadProviderProps } from "./context";

export interface FileUploadProps extends FileUploadProviderProps {
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ className, children, disabled, ...providerProps }) => {
  return (
    <FileUploadProvider {...providerProps} disabled={disabled}>
      <div className={cn("flex flex-col flex-1 space-y-4", className, disabled && "opacity-50 cursor-not-allowed")}>{children}</div>
    </FileUploadProvider>
  );
};

export default FileUpload;

// Re-export all components and types
export { FileError } from "./components/file-error";
export { FileProgress } from "./components/file-progress";
export { FileItem } from "./components/file-item";
export { FileList } from "./components/file-list";
export { DropZone } from "./components/drop-zone";
export { FileTypeIcon } from "./components/file-type-icon";
export { useFileUpload, FileUploadProvider } from "./context";
export { formatFileSize } from "./utils";
export type { FileInfo, FileStatus, FileUploadContextType } from "./types";
export { FileStatus as FileStatusEnum } from "./types";

// Type-only exports with proper syntax
export type { FileErrorProps } from "./components/file-error";
export type { FileProgressProps } from "./components/file-progress";
export type { FileItemProps } from "./components/file-item";
export type { FileListProps } from "./components/file-list";
export type { DropZoneProps } from "./components/drop-zone";
export type { FileUploadProviderProps } from "./context";
