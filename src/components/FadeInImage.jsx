import { useEffect, useRef, useState } from "react";

export function FadeInImage({ src, alt, className = "", loading = "lazy" }) {
  const imageRef = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setLoadedSrc(src);
  }, [src]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      loading={loading}
      onLoad={() => setLoadedSrc(src)}
      className={`transition-[opacity,transform] duration-300 motion-reduce:transition-none ${loadedSrc === src ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}

export default FadeInImage;