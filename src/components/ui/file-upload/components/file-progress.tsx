import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

  if (!fileStatus || fileProgress === undefined || fileStatus === FileStatus.Completed) return null;

  const getProgressColor = () => {
    switch (fileStatus) {
      case FileStatus.Error:
        return "bg-destructive";
      case FileStatus.Paused:
        return "bg-amber-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={cn("w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", getProgressColor())}
        initial={{ width: 0 }}
        animate={{ width: fileProgress + "%" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      />
    </div>
  );
};
