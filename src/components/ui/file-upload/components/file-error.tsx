import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "../context";

export interface FileErrorProps {
  message?: string;
  onClose?: () => void;
  className?: string;
  autoHideDuration?: number;
}

export const FileError: React.FC<FileErrorProps> = ({ message, onClose, className, autoHideDuration = 5000 }) => {
  const { error, setError } = useFileUpload();
  const [isVisible, setIsVisible] = useState(true);
  const displayMessage = message || error;

  useEffect(() => {
    if (displayMessage && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [displayMessage, autoHideDuration]);

  useEffect(() => {
    if (displayMessage) {
      setIsVisible(true);
    }
  }, [displayMessage]);

  if (!displayMessage) return null;

  const handleClose = () => {
    setIsVisible(false);
    setError(null);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && displayMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn("relative overflow-hidden rounded-lg border border-destructive/30 bg-destructive/5 shadow-lg", className)}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-destructive/10 via-destructive/5 to-destructive/10"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Progress bar for auto-hide */}
          {autoHideDuration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-destructive/40"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoHideDuration / 1000, ease: "linear" }}
            />
          )}

          <div className="relative flex items-start gap-3 p-4">
            <motion.div initial={{ rotate: 0 }} animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5, delay: 0.2 }} className="shrink-0 mt-0.5">
              <div className="p-1.5 rounded-full bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-sm font-medium text-destructive">
                Upload Error
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="text-sm text-destructive/80 mt-0.5">
                {displayMessage}
              </motion.p>
            </div>

            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 rounded-full text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
