'use client';

import { cn } from '@/lib/utils';

interface CancelEditButtonProps {
  className?: string;
}

export function CancelEditButton({ className }: CancelEditButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md border border-border bg-white px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted',
        className,
      )}
      onClick={(event) => {
        const button = event.currentTarget;
        button.closest('form')?.reset();

        const details = button.closest('details');
        if (details) {
          details.open = false;
        }
      }}
    >
      Cancel
    </button>
  );
}
