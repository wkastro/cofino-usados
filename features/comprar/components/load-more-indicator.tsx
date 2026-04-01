"use client";

import { Loader2 } from "lucide-react";

export function LoadMoreIndicator() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
