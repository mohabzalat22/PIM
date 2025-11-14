import { useState } from "react";

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function SkeletonImage({ src, alt, className }: SkeletonImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative flex items-center justify-center w-96 mx-auto">
      {isLoading && !hasError && (
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded border w-full aspect-square" />
      )}

      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`${className ?? ""} ${
            isLoading ? "opacity-0" : "opacity-100"
          } object-contain max-w-96 max-h-96`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}

      {hasError && (
        <div className="text-sm text-red-500">Failed to load image</div>
      )}
    </div>
  );
}
