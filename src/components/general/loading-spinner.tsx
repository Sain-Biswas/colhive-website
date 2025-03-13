import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  isVisible: boolean;
  className?: string;
}

export default function LoadingSpinner({
  isVisible,
  className,
}: LoadingSpinnerProps) {
  if (!isVisible) return <></>;

  return (
    <div
      className={cn(
        "size-3 animate-spin rounded-full border-t-2 text-transparent",
        className
      )}
    >
      .
    </div>
  );
}
