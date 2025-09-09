import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
};

export function LoadingSpinner({ 
  size = "md", 
  className,
  text 
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className="text-sm text-gray-600 animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
}

export function LoadingOverlay({ 
  text = "Loading...",
  className 
}: { 
  text?: string; 
  className?: string;
}) {
  return (
    <div className={cn(
      "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export function LoadingSkeleton({
  className,
  lines = 6,
  columns = 5,
  itemClassName,
}: {
  className?: string;
  lines?: number;
  columns?: number;
  itemClassName?: string;
}) {
  // lines: number of rows, columns: number of columns
  return (
    <div
      className={cn(
        "animate-pulse grid gap-4",
        `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columns}`,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: lines * columns }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-gray-200 rounded-lg h-32 w-full",
            itemClassName
          )}
        />
      ))}
    </div>
  );
}
