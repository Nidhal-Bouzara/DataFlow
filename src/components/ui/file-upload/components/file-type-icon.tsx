import { Image, FileText } from "lucide-react";

export const FileTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type.includes("image")) {
    return <Image aria-label="Image file" />;
  } else {
    return <FileText aria-label="Document file" />;
  }
};
