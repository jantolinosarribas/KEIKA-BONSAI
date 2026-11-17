import { useState } from "react";
import { ChevronLeft, ChevronRight, Sprout, ZoomIn } from "lucide-react";
import { formatPlantPhotoDate } from "../data/plants";
import FadeInImage from "./FadeInImage";

/** @param {{ photos?: import("../data/plants").PlantPhoto[], plantName: string, variant?: "card" | "detail" }} props */
export default function PlantPhotoGallery({ photos = [], plantName, variant = "card" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedPhotoSrc, setLoadedPhotoSrc] = useState(null);
  const isDetail = variant === "detail";
  const currentPhoto = photos[activeIndex];
  const isPhotoLoading = Boolean(currentPhoto) && loadedPhotoSrc !== currentPhoto.src;
  const frameSize = isDetail
    ? currentPhoto ? "max-h-[70vh]" : "aspect-[4/3]"
    : "aspect-square";
  const imageSize = isDetail
    ? "block h-auto max-h-[70vh] w-auto max-w-full object-contain"
    : "size-full object-cover";

  function movePhoto(event, direction) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((index) => (index + direction + photos.length) % photos.length);
  }

  function selectPhoto(event, index) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(index);
  }

  return (
    <figure className="min-w-0">
      <div
        data-loading={!isDetail && isPhotoLoading ? "true" : undefined}
        className={`plant-photo-frame relative flex w-full items-center justify-center overflow-hidden bg-green-900/5 ${frameSize}`}
      >
        {currentPhoto ? (
          <FadeInImage
            key={`${currentPhoto.src}-${activeIndex}`}
            src={currentPhoto.src}
            alt={currentPhoto.alt || plantName}
            loading={isDetail ? "eager" : "lazy"}
            onLoaded={setLoadedPhotoSrc}
            className={imageSize}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 text-green-900/45">
            <Sprout aria-hidden="true" size={isDetail ? 40 : 30} strokeWidth={1.4} />
            <span className="text-sm">Foto pendiente</span>
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => movePhoto(event, -1)}
              aria-label={`Foto anterior de ${plantName}`}
              title="Foto anterior"
              className="absolute top-1/2 left-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white/90 shadow-sm backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(event) => movePhoto(event, 1)}
              aria-label={`Foto siguiente de ${plantName}`}
              title="Foto siguiente"
              className="absolute top-1/2 right-2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white/90 shadow-sm backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </>
        )}

        {isDetail && currentPhoto && (
          <button
            type="button"
            data-image-viewer
            data-image-src={currentPhoto.src}
            data-image-alt={currentPhoto.alt || plantName}
            data-image-gallery={JSON.stringify(photos.map((photo) => ({
              ...photo,
              dateLabel: formatPlantPhotoDate(photo.date),
            })))}
            data-image-index={activeIndex}
            aria-haspopup="dialog"
            aria-label={`Ampliar foto de ${plantName}`}
            title="Ampliar foto"
            className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded bg-black/55 text-white hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ZoomIn size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      {photos.length > 1 && (
        <div role="group" aria-label={`Seleccionar foto de ${plantName}`} className="mt-4 flex items-center justify-center gap-1">
          {photos.map((photo, index) => (
            <button
              key={`${photo.src}-${index}`}
              type="button"
              onClick={(event) => selectPhoto(event, index)}
              aria-label={`Mostrar foto ${index + 1} de ${photos.length}`}
              aria-pressed={activeIndex === index}
              className="group flex size-3 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
            >
              <span className={`rounded-full transition-all duration-300 ${activeIndex === index ? "size-1.5 bg-green-900" : "size-1 bg-green-900/35 group-hover:bg-green-900/70"}`} />
            </button>
          ))}
        </div>
      )}
      {isDetail && currentPhoto && (
        <figcaption className="mt-3 text-center text-sm text-green-800">
          <time dateTime={currentPhoto.date || undefined}>{formatPlantPhotoDate(currentPhoto.date)}</time>
          {photos.length > 1 && <span className="ml-2 text-green-900/55">{activeIndex + 1} / {photos.length}</span>}
        </figcaption>
      )}
    </figure>
  );
}