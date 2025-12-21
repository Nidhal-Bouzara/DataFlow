import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, CheckCircle2, XCircle } from "lucide-react";
import { cn, generateUniqueId } from "@/lib/utils";
import { useFileUpload } from "../context";
import { FileStatus } from "../types";
import { motion, AnimatePresence } from "framer-motion";

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

type DropZoneState = "idle" | "dragging" | "success" | "error";

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelect: propOnFileSelect,
  prompt = "Click or drag files to upload",
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

  const [state, setState] = useState<DropZoneState>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (fileInputRef.current && contextFiles.length === 0) {
      fileInputRef.current.value = "";
    }
  }, [contextFiles]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const showFeedback = useCallback((newState: DropZoneState, message: string, duration: number = 2000) => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    setState(newState);
    setFeedbackMessage(message);
    feedbackTimeoutRef.current = setTimeout(() => {
      setState("idle");
      setFeedbackMessage("");
    }, duration);
  }, []);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "success" && state !== "error") {
      setState("dragging");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === "dragging") {
      setState("idle");
    }
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

  const processFiles = (selectedFiles: File[]) => {
    const validation = contextValidateFiles(selectedFiles);

    if (!validation.valid) {
      if (onError && validation.errorMessage) {
        onError(validation.errorMessage);
      }
      showFeedback("error", validation.errorMessage || "Invalid files", 2500);
      return;
    }

    onFileSelect?.(selectedFiles);
    contextOnFileSelectChange?.(getFileInfos(selectedFiles));
    showFeedback("success", `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} added!`, 2000);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    } else {
      setState("idle");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const getStateStyles = () => {
    switch (state) {
      case "dragging":
        return "border-primary bg-primary/5 scale-[1.02]";
      case "success":
        return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30";
      case "error":
        return "border-destructive bg-destructive/10";
      default:
        return "border-[#00000020] border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50";
    }
  };

  const iconVariants = {
    idle: { scale: 1, y: 0 },
    dragging: { scale: 1.1, y: -4 },
    success: { scale: 1, y: 0 },
    error: { scale: 1, y: 0 },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
        "flex flex-col items-center justify-center gap-3",
        getStateStyles(),
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={state === "idle" && !disabled ? { scale: 1.01 } : {}}
      whileTap={state === "idle" && !disabled ? { scale: 0.99 } : {}}
    >
      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <motion.svg className="absolute inset-0 h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" initial="hidden" animate="visible">
                <motion.circle cx="12" cy="12" r="10" className="text-emerald-500/30" variants={checkmarkVariants} />
              </motion.svg>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
            >
              {feedbackMessage}
            </motion.p>
          </motion.div>
        ) : state === "error" ? (
          <motion.div
            key="error"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div animate={{ x: [0, -5, 5, -5, 5, 0] }} transition={{ duration: 0.4 }}>
              <XCircle className="h-10 w-10 text-destructive border-b-rose-300" />
            </motion.div>
            <p className="text-sm font-medium text-destructive text-rose-300">{feedbackMessage}</p>
          </motion.div>
        ) : (
          <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
            <motion.div
              variants={iconVariants}
              animate={state}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn("p-3 rounded-full transition-colors duration-300", state === "dragging" ? "bg-primary/10" : "bg-muted")}
            >
              <Upload className={cn("h-6 w-6 transition-colors duration-300", state === "dragging" ? "text-primary" : "text-muted-foreground")} />
            </motion.div>
            <div className="space-y-1">
              <p className={cn("text-sm font-medium transition-colors duration-300", state === "dragging" ? "text-primary" : "text-foreground")}>
                {state === "dragging" ? "Drop files here" : prompt}
              </p>
              {maxSize && <p className="text-xs text-muted-foreground">Max file size: {maxSize}MB</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={handleFileInputChange} disabled={disabled} />
    </motion.div>
  );
};
