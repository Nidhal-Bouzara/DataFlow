/**
 * Formats a byte count into a human-readable string
 *
 * @param bytes - The number of bytes to format
 * @returns A formatted string (e.g., "1.5 MB", "256 KB")
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536000) // "1.46 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
