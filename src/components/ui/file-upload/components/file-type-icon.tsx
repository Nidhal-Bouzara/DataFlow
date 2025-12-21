import { FileText, Image as ImageIcon, Sheet, File, Archive, Video, Music, Code2, Presentation } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileTypeIconProps {
  type: string;
  fileName?: string;
  className?: string;
}

const getFileExtension = (fileName: string): string => {
  return fileName.split(".").pop()?.toLowerCase() || "";
};

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ type, fileName = "", className }) => {
  const extension = getFileExtension(fileName);
  const iconClass = cn("h-6 w-6", className);

  // PDF files
  if (type === "application/pdf" || extension === "pdf") {
    return (
      <div className="relative">
        <FileText className={cn(iconClass, "text-red-600 fill-red-50 stroke-[1.5]")} aria-label="PDF file" />
      </div>
    );
  }

  // Word documents
  if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ["doc", "docx"].includes(extension)) {
    return (
      <div className="relative">
        <FileText className={cn(iconClass, "text-blue-600 fill-blue-50 stroke-[1.5]")} aria-label="Word document" />
      </div>
    );
  }

  // Excel/Spreadsheet files
  if (
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "text/csv" ||
    ["xls", "xlsx", "csv"].includes(extension)
  ) {
    return (
      <div className="relative">
        <Sheet className={cn(iconClass, "text-green-600 fill-green-50 stroke-[1.5]")} aria-label="Spreadsheet file" />
      </div>
    );
  }

  // PowerPoint files
  if (type === "application/vnd.ms-powerpoint" || type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" || ["ppt", "pptx"].includes(extension)) {
    return (
      <div className="relative">
        <Presentation className={cn(iconClass, "text-orange-600 fill-orange-50 stroke-[1.5]")} aria-label="Presentation file" />
      </div>
    );
  }

  // Image files
  if (type.startsWith("image/")) {
    const imageColors: Record<string, { text: string; fill: string }> = {
      png: { text: "text-purple-600", fill: "fill-purple-50" },
      jpg: { text: "text-amber-600", fill: "fill-amber-50" },
      jpeg: { text: "text-amber-600", fill: "fill-amber-50" },
      gif: { text: "text-pink-600", fill: "fill-pink-50" },
      svg: { text: "text-cyan-600", fill: "fill-cyan-50" },
      webp: { text: "text-indigo-600", fill: "fill-indigo-50" },
    };
    const colors = imageColors[extension] || { text: "text-purple-600", fill: "fill-purple-50" };
    return (
      <div className="relative">
        <ImageIcon className={cn(iconClass, colors.text, colors.fill, "stroke-[1.5]")} aria-label="Image file" />
      </div>
    );
  }

  // Video files
  if (type.startsWith("video/") || ["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
    return (
      <div className="relative">
        <Video className={cn(iconClass, "text-pink-600 fill-pink-50 stroke-[1.5]")} aria-label="Video file" />
      </div>
    );
  }

  // Audio files
  if (type.startsWith("audio/") || ["mp3", "wav", "ogg", "flac", "aac"].includes(extension)) {
    return (
      <div className="relative">
        <Music className={cn(iconClass, "text-violet-600 fill-violet-50 stroke-[1.5]")} aria-label="Audio file" />
      </div>
    );
  }

  // Archive files
  if (type === "application/zip" || type === "application/x-rar-compressed" || type === "application/x-7z-compressed" || ["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
    return (
      <div className="relative">
        <Archive className={cn(iconClass, "text-yellow-600 fill-yellow-50 stroke-[1.5]")} aria-label="Archive file" />
      </div>
    );
  }

  // Code files
  if (
    type.includes("javascript") ||
    type.includes("typescript") ||
    type.includes("json") ||
    type.includes("html") ||
    type.includes("css") ||
    ["js", "ts", "jsx", "tsx", "json", "html", "css", "py", "rb", "go", "rs", "java", "cpp", "c", "h"].includes(extension)
  ) {
    return (
      <div className="relative">
        <Code2 className={cn(iconClass, "text-slate-600 fill-slate-50 stroke-[1.5]")} aria-label="Code file" />
      </div>
    );
  }

  // Default file icon
  return (
    <div className="relative">
      <File className={cn(iconClass, "text-gray-600 fill-gray-50 stroke-[1.5]")} aria-label="File" />
    </div>
  );
};
