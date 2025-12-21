import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Upload, Files } from "lucide-react";
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

  const pendingCount = files.filter((f) => f.status === FileStatus.Pending).length;
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const formatTotalSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-3", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Files className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {files.length} {files.length === 1 ? "File" : "Files"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Total: {formatTotalSize(totalSize)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showUploadButton && pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="sm" 
                onClick={onUpload}
                className="gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload {pendingCount > 1 ? "(" + pendingCount + ")" : ""}
              </Button>
            </motion.div>
          )}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onClear}
              className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </Button>
          </motion.div>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onPause={handlePause}
              onResume={handleResume}
              onRemove={onRemove}
              canResume={canResume}
              canRemove={canRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
