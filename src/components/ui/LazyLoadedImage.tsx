
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LazyLoadedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Efekt do obserwowania widoczności obrazu na stronie
  useEffect(() => {
    // Funkcja do załadowania obrazu
    const loadImage = () => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setIsLoaded(true);
        setIsError(false);
        if (onLoad) onLoad();
      };
      
      img.onerror = () => {
        setIsLoaded(false);
        setIsError(true);
        if (onError) onError();
        console.error(`Failed to load image: ${src}`);
      };
    };
    
    // Obserwator intersection (czy obraz jest w widoku)
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadImage();
        // Przestań obserwować gdy obraz jest już załadowany
        if (observer.current && imageRef.current) {
          observer.current.unobserve(imageRef.current);
        }
      }
    }, {
      rootMargin: '200px' // Zacznij ładować obrazy gdy są 200px od widocznego obszaru
    });
    
    // Zarejestruj element do obserwacji
    if (imageRef.current) {
      observer.current.observe(imageRef.current);
    }
    
    // Czyszczenie obserwatora przy odmontowaniu komponentu
    return () => {
      if (observer.current && imageRef.current) {
        observer.current.unobserve(imageRef.current);
        observer.current.disconnect();
      }
    };
  }, [src, onLoad, onError]);
  
  return (
    <div 
      ref={imageRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder widoczny podczas ładowania obrazu */}
      {!isLoaded && (
        <div 
          className={cn(
            'absolute inset-0 bg-black/20 animate-pulse',
            placeholderClassName
          )} 
        />
      )}
      
      {/* Obraz właściwy */}
      {!isError ? (
        <img
          src={isLoaded ? src : ''}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          style={{ width, height }}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-800 text-white/50">
          <span>Image Error</span>
        </div>
      )}
    </div>
  );
};

export default LazyLoadedImage;
