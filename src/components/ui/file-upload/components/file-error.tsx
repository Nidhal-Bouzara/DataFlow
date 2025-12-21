import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "../context";

export interface FileErrorProps {
  message?: string;
  onClose?: () => void;
  className?: string;
  autoHideDuration?: number;
}

export const FileError: React.FC<FileErrorProps> = ({ message, onClose, className }) => {
  const { error } = useFileUpload();
  const [isVisible, setIsVisible] = useState(true);
  const displayMessage = message || error;

  if (!displayMessage) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && displayMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={cn("flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md", className)}
        >
          <div className="flex items-center gap-2">
            <CircleAlert />
            <p className="text-sm">{displayMessage}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/20" onClick={handleClose}>
            <X />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
