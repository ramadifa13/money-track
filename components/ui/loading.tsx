"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: number;
}

export function Loading({ text = "Memuat...", className, size = 24 }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-6 text-muted-foreground", className)}>
      <Loader2 className="animate-spin" size={size} />
      <span className="text-sm">{text}</span>
    </div>
  );
}
