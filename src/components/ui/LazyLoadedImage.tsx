
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyLoadedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  rootMargin?: string;
  threshold?: number | number[];
  onLoad?: () => void;
  onError?: () => void;
  loadingClassName?: string;
  errorClassName?: string;
  containerClassName?: string;
  fallbackElement?: React.ReactNode;
}

export const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({
  src,
  alt,
  placeholderSrc = '/placeholder.svg',
  rootMargin = '0px',
  threshold = 0.1,
  onLoad,
  onError,
  className,
  loadingClassName,
  errorClassName,
  containerClassName,
  fallbackElement,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const imgRef = useRef<HTMLImageElement | null>(null);
  
  useEffect(() => {
    // Reset states when src changes
    if (src) {
      setIsLoaded(false);
      setIsError(false);
      setCurrentSrc(placeholderSrc);
    }

    // Intersection Observer setup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Element is now visible, load the actual image
            const img = new Image();
            img.src = src;
            
            img.onload = () => {
              setCurrentSrc(src);
              setIsLoaded(true);
              onLoad?.();
            };
            
            img.onerror = () => {
              setIsError(true);
              onError?.();
            };
            
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, placeholderSrc, rootMargin, threshold, onLoad, onError]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isError && fallbackElement ? (
        fallbackElement
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            className,
            !isLoaded && loadingClassName,
            isError && errorClassName,
            isLoaded ? "opacity-100 transition-opacity duration-300" : "opacity-70"
          )}
          {...imgProps}
        />
      )}
      
      {/* Loading overlay */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-neon-blue"></div>
        </div>
      )}
      
      {/* Error overlay */}
      {isError && !fallbackElement && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-30 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="mt-2 text-sm">Nie udało się załadować obrazu</span>
        </div>
      )}
    </div>
  );
};
