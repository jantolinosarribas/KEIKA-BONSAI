import { useState } from "react";
import { ChevronLeft, ChevronRight, Sprout, ZoomIn } from "lucide-react";
import { formatPlantPhotoDate } from "../data/plants";
import FadeInImage from "./FadeInImage";

/** @param {{ photos?: import("../data/plants").PlantPhoto[], plantName: string, variant?: "card" | "detail" }} props */
export default function PlantPhotoGallery({ photos = [], plantName, variant = "card" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDetail = variant === "detail";
  const currentPhoto = photos[activeIndex];

  function movePhoto(event, direction) {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((index) => (index + direction + photos.length) % photos.length);
  }

  return (
    <figure className={isDetail ? "min-w-0" : "min-w-0"}>
      <div className={`relative overflow-hidden bg-green-900/5 ${isDetail ? "flex aspect-[4/3] items-center justify-center" : "aspect-[4/3]"}`}>
        {currentPhoto ? (
          <FadeInImage
            src={currentPhoto.src}
            alt={currentPhoto.alt || plantName}
            loading={isDetail ? "eager" : "lazy"}
            className={`size-full ${isDetail ? "object-contain" : "object-cover transition-transform duration-300 hover:scale-[1.03]"}`}
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
              className="absolute top-1/2 left-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded bg-black/55 text-white hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(event) => movePhoto(event, 1)}
              aria-label={`Foto siguiente de ${plantName}`}
              title="Foto siguiente"
              className="absolute top-1/2 right-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded bg-black/55 text-white hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <span aria-live="polite" aria-atomic="true" className="absolute bottom-2 left-2 rounded bg-black/55 px-2 py-1 text-xs text-white">
              {activeIndex + 1} / {photos.length}
            </span>
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
      {isDetail && currentPhoto && (
        <figcaption className="mt-3 text-center text-sm text-green-800">
          <time dateTime={currentPhoto.date || undefined}>{formatPlantPhotoDate(currentPhoto.date)}</time>
          {photos.length > 1 && <span className="ml-2 text-green-900/55">{activeIndex + 1} / {photos.length}</span>}
        </figcaption>
      )}
    </figure>
  );
}