import { createContext, useContext, useState } from "react";
import type { FileInfo, FileUploadContextType } from "./types";

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploadProvider");
  }
  return context;
};

export interface FileUploadProviderProps {
  children: React.ReactNode;
  files?: FileInfo[];
  showUploadButton?: boolean;
  multiple?: boolean;
  accept?: string;
  maxCount?: number;
  maxSize?: number;
  onFileSelect?: (files: File[]) => void;
  onFileSelectChange?: (files: FileInfo[]) => void;
  onUpload?: () => void;
  onPause?: (fileId: string) => void;
  onResume?: (fileId: string) => void;
  onRemove?: (fileId: string) => void;
  disabled?: boolean;
}

export const FileUploadProvider: React.FC<FileUploadProviderProps> = ({
  children,
  files = [],
  multiple = false,
  accept,
  maxCount = 1,
  maxSize = 1,
  onFileSelect,
  onFileSelectChange,
  onUpload,
  onPause,
  onResume,
  onRemove,
  disabled = false,
}) => {
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): { valid: boolean; errorMessage?: string } => {
    if (maxCount && files.length > maxCount) {
      return {
        valid: false,
        errorMessage: `can upload maxinum ${maxCount} files`,
      };
    }

    if (maxSize) {
      const oversizedFiles = files.filter((file) => file.size > maxSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map((f) => f.name).join(", ");
        return {
          valid: false,
          errorMessage: `file size exceed limit (${maxSize}MB): ${fileNames}`,
        };
      }
    }

    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const invalidFiles = files.filter((file) => {
        const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
        return !acceptedTypes.some((type) => type === fileExt || type === file.type || (type.includes("/*") && file.type.startsWith(type.replace("/*", "/"))));
      });

      if (invalidFiles.length > 0) {
        const fileNames = invalidFiles.map((f) => f.name).join(", ");
        return {
          valid: false,
          errorMessage: `file type can't support: ${fileNames}`,
        };
      }
    }

    return { valid: true };
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        error,
        setError,
        maxCount,
        maxSize,
        accept,
        multiple,
        validateFiles,
        onFileSelect,
        onFileSelectChange,
        onUpload,
        onPause,
        onResume,
        onRemove,
        disabled,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
