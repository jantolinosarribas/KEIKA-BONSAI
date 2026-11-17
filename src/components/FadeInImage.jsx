import { useEffect, useRef, useState } from "react";

/** @param {{ src: string, alt: string, className?: string, loading?: "eager" | "lazy", isVisible?: boolean, draggable?: boolean, width?: number, height?: number, onLoaded?: (src: string) => void }} props */
export function FadeInImage({ src, alt, className = "", loading = "lazy", isVisible = true, draggable, width, height, onLoaded }) {
  const imageRef = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);
  const isLoaded = loadedSrc === src;
  const visibilityClass = isLoaded ? (isVisible ? "opacity-100" : "opacity-45") : "opacity-0";
  const markLoaded = () => {
    setLoadedSrc(src);
    onLoaded?.(src);
  };

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) markLoaded();
  }, [src]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      loading={loading}
      draggable={draggable}
      width={width}
      height={height}
      onLoad={markLoaded}
      className={`transition-opacity duration-500 ease-out motion-reduce:transition-none ${visibilityClass} ${className}`}
    />
  );
}

export default FadeInImage;