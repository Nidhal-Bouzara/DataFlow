import { useState } from "react";
import { Trash2, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
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
  const [isHovered, setIsHovered] = useState(false);

  let file = propFile;
  if (!file && fileId) {
    file = files.find((f) => f.id === fileId);
  }

  if (!file) return null;

  const getStatusColor = () => {
    switch (file.status) {
      case FileStatus.Error:
        return "border-destructive/30 bg-destructive/5";
      case FileStatus.Completed:
        return "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30";
      case FileStatus.Uploading:
        return "border-primary/30 bg-primary/5";
      default:
        return "border-border bg-background";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group flex items-center gap-4 p-4 lg:p-5 rounded-xl border transition-all duration-200",
        "hover:shadow-lg hover:border-primary/30",
        getStatusColor(),
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* File Icon with animated background */}
      <motion.div className={cn("shrink-0 p-3 lg:p-4 rounded-xl transition-colors duration-200", isHovered ? "bg-primary/10" : "bg-muted/50")} whileHover={{ scale: 1.05 }}>
        <FileTypeIcon type={file.type} fileName={file.name} />
      </motion.div>

      {/* File Info */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-base lg:text-lg font-semibold text-foreground truncate leading-tight" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs lg:text-sm text-muted-foreground/70">{formatFileSize(file.size)}</span>
              {file.status === FileStatus.Error && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-destructive font-medium px-1.5 py-0.5 rounded bg-destructive/10"
                >
                  {file.error || "Upload failed"}
                </motion.span>
              )}
              {file.status === FileStatus.Completed && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30"
                >
                  Completed
                </motion.span>
              )}
              {file.status === FileStatus.Pending && <span className="text-xs lg:text-sm text-muted-foreground/60 font-medium px-2.5 py-1 rounded-full bg-muted/60">Ready</span>}
            </div>
          </div>
        </div>

        {showProgress && <FileProgress progress={file.progress} status={file.status} />}
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 flex items-center gap-1">
        {canResume && (
          <>
            {file.status === FileStatus.Uploading && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onPause(file.id)}>
                  <Pause className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
            {file.status === FileStatus.Paused && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary" onClick={() => onResume(file.id)}>
                  <Play className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}

        {canRemove && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0.6,
              scale: 1,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              size="icon"
              variant="ghost"
              className={cn("h-8 w-8 transition-colors duration-200", "text-muted-foreground hover:text-destructive hover:bg-destructive/10")}
              onClick={() => onRemove(file.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
