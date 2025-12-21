import { Trash, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "../context";
import { FileStatus, type FileInfo } from "../types";
import { formatFileSize } from "../utils";
import { FileTypeIcon } from "./file-type-icon";
import { FileProgress } from "./file-progress";

export interface FileItemProps {
  file?: FileInfo;
  fileId?: string;
  onPause?: (fileId: string) => void;
  onResume?: (fileId: string) => void;
  onRemove?: (fileId: string) => void;
  className?: string;
  canResume?: boolean;
  canRemove?: boolean;
  showProgress?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({
  file: propFile,
  fileId,
  onPause = () => {},
  onResume = () => {},
  onRemove = () => {},
  className,
  canResume = false,
  canRemove = true,
  showProgress = false,
}) => {
  const { files } = useFileUpload();

  let file = propFile;
  if (!file && fileId) {
    file = files.find((f) => f.id === fileId);
  }

  if (!file) return null;

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-md border bg-background shadow-sm", className)}>
      <div className="shrink-0">
        <FileTypeIcon type={file.type} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col">
          <p className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
            {file.status === FileStatus.Error && <span className="text-destructive ml-2">{file.error || "File to upload"}</span>}
          </p>
        </div>

        {showProgress && <FileProgress progress={file.progress} status={file.status} />}
      </div>

      {canResume && (
        <div className="shrink-0 flex items-center gap-1">
          {file.status === FileStatus.Uploading && (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onPause(file.id)}>
              <Pause />
            </Button>
          )}
          {file.status === FileStatus.Paused && (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onResume(file.id)}>
              <Play />
            </Button>
          )}
        </div>
      )}
      {canRemove && (
        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onRemove(file.id)}>
          <Trash />
        </Button>
      )}
    </div>
  );
};
