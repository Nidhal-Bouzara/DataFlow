export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  progress: number;
  status: FileStatus;
  error?: string;
}

export enum FileStatus {
  Uploading,
  Paused,
  Completed,
  Error,
  Cancelled,
  Pending,
}

export interface FileUploadContextType {
  files: FileInfo[];
  error: string | null;
  setError: (error: string | null) => void;
  maxCount?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  validateFiles: (files: File[]) => { valid: boolean; errorMessage?: string };
  onFileSelect?: (files: File[]) => void;
  onFileSelectChange?: (files: FileInfo[]) => void;
  onUpload?: () => void;
  onPause?: (fileId: string) => void;
  onResume?: (fileId: string) => void;
  onRemove?: (fileId: string) => void;
  disabled?: boolean;
}
