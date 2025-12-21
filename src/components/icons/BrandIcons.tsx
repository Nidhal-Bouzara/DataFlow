import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  size?: number;
}

export function AppLogo({ className, size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={cn(className)}>
      <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
      <path d="M4 10l12 6 12-6" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16v12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
