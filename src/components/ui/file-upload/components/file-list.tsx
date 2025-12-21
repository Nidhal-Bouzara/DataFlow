import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "../context";
import { FileStatus, type FileInfo } from "../types";
import { FileItem } from "./file-item";

export interface FileListProps {
  files?: FileInfo[];
  onPause?: (fileId: string) => void;
  onResume?: (fileId: string) => void;
  onRemove?: (fileId: string) => void;
  onClear?: () => void;
  showUploadButton?: boolean;
  onUpload?: () => void;
  className?: string;
  canResume?: boolean;
  canRemove?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files: propFiles,
  onPause,
  onResume,
  onRemove,
  onClear = () => {},
  showUploadButton = false,
  className,
  canResume,
  canRemove,
}) => {
  const { files: contextFiles, onUpload = () => {} } = useFileUpload();

  const files = propFiles || contextFiles;

  if (files.length === 0) return null;

  const handlePause = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      file.status = FileStatus.Paused;
      onPause?.(fileId);
    }
  };

  const handleResume = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      file.status = FileStatus.Uploading;
      onResume?.(fileId);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">File List</h3>
        <div className="flex gap-2">
          {showUploadButton && files.some((file) => file.status === FileStatus.Pending) && onUpload && (
            <Button size="sm" onClick={onUpload}>
              Satrt Upload
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onClear}>
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-75 overflow-y-auto">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onPause={handlePause} onResume={handleResume} onRemove={onRemove} canResume={canResume} canRemove={canRemove} />
        ))}
      </div>
    </div>
  );
};
