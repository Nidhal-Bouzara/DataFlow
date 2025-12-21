import { cn } from "@/lib/utils";
import { useFileUpload } from "../context";
import { FileStatus, type FileInfo } from "../types";

export interface FileProgressProps {
  progress?: number;
  status?: FileInfo["status"];
  fileId?: string;
  className?: string;
}

export const FileProgress: React.FC<FileProgressProps> = ({ progress, status, fileId, className }) => {
  const { files } = useFileUpload();

  let fileStatus = status;
  let fileProgress = progress;

  if (fileId) {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      fileStatus = file.status;
      fileProgress = file.progress;
    }
  }

  if (!fileStatus || !fileProgress || fileStatus === FileStatus.Completed) return null;

  return (
    <div className={cn("w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full", fileStatus === FileStatus.Error ? "bg-destructive" : fileStatus === FileStatus.Paused ? "bg-amber-500" : "bg-primary")}
        style={{ width: `${fileProgress}%` }}
      ></div>
    </div>
  );
};
