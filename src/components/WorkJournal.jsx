import { useEffect, useRef, useState } from "react";
import { ZoomIn } from "lucide-react";
import { plants } from "../data/plants";
import { journalEntries } from "../data/journalEntries";

const categories = [
  { id: "prebonsais", label: "Prebonsais", singular: "prebonsáis" },
  { id: "bonsais", label: "Bonsais", singular: "bonsáis" },
];

export default function WorkJournal({ plantId, embedded = false }) {
  const [activeCategory, setActiveCategory] = useState(
    plants.find((plant) => plant.id === journalEntries[0]?.plantId)?.category ?? categories[0].id,
  );
  const tabRefs = useRef([]);
  const selectedPlant = plants.find((plant) => plant.id === plantId);

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get(
      "categoria",
    );

    if (categories.some((category) => category.id === requestedCategory)) {
      setActiveCategory(requestedCategory);
    }
  }, []);

  const activeCategoryIndex = categories.findIndex(
    (category) => category.id === activeCategory,
  );
  const activeCategoryData = categories[activeCategoryIndex];
  const entries = journalEntries
    .filter((entry) => {
      const plant = plants.find((plant) => plant.id === entry.plantId);
      return selectedPlant
        ? entry.plantId === selectedPlant.id
        : plant?.category === activeCategory;
    })
    .sort((first, second) => second.date.localeCompare(first.date));

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % categories.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex + categories.length - 1) % categories.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = categories.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveCategory(categories[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <section className={embedded ? "w-full" : "w-full px-6 pb-32 md:px-10"}>
      <div className="mx-auto max-w-5xl">
        {!selectedPlant && (
        <div
          className="flex gap-7 border-b border-green-900/20"
          role="tablist"
          aria-label="Filtrar diario por tipo de árbol"
        >
          {categories.map((category, index) => {
            const isSelected = category.id === activeCategory;

            return (
              <button
                key={category.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`tab-${category.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`panel-${category.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveCategory(category.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`border-b-2 px-1 pb-3 text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 ${isSelected ? "border-green-800 text-green-900" : "border-transparent text-green-900/55 hover:text-green-800"}`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
        )}

        <div
          id={selectedPlant ? undefined : `panel-${activeCategory}`}
          role={selectedPlant ? undefined : "tabpanel"}
          aria-labelledby={selectedPlant ? undefined : `tab-${activeCategory}`}
          tabIndex={selectedPlant ? undefined : 0}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
        >
          {entries.length > 0 ? (
            <ol className="mt-6 space-y-6">
              {entries.map((entry) => {
                const plant = plants.find((plant) => plant.id === entry.plantId);
                return (
                  <li key={entry.id} id={entry.id} className="scroll-mt-24">
                    <article className={`grid items-start gap-8 rounded-lg border border-green-900/20 bg-white/20 p-5 md:p-8 ${entry.photos?.length ? "md:grid-cols-[minmax(0,1fr)_16rem]" : ""}`}>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-green-700">
                          <time dateTime={entry.date}>{entry.dateLabel}</time>
                          {entry.isMock && <span className="text-green-900/60">Entrada de ejemplo</span>}
                        </div>
                        <p className="mt-2 text-lg text-green-900">
                          <a
                            href={`/arbolario/${entry.plantId}`}
                            className="underline decoration-green-800/30 underline-offset-4 hover:decoration-green-800"
                          >
                            {plant?.commonName}
                          </a>
                        </p>
                        <p className="mt-1 text-sm italic text-green-900/70">{plant?.scientificName}</p>
                        <h2 className="mt-6 break-words text-3xl leading-tight font-medium text-green-950">{entry.title}</h2>
                        <p className="mt-2 max-w-3xl leading-relaxed text-green-900">{entry.description}</p>
                        {entry.observation && (
                          <p className="mt-3 max-w-3xl leading-relaxed text-green-900/75">
                            <span className="font-medium">Observaciones: </span>
                            {entry.observation}
                          </p>
                        )}
                        {entry.nextStep && (
                          <p className="mt-3 max-w-3xl leading-relaxed text-green-900/75">
                            <span className="font-medium">Siguiente paso: </span>
                            {entry.nextStep}
                          </p>
                        )}
                      </div>
                      {entry.photos?.length > 0 && (
                        <div aria-label={`Fotos de ${plant?.commonName}`} className="grid grid-cols-2 gap-3 md:grid-cols-1">
                          {entry.photos.slice(0, 2).map((photo, photoIndex) => {
                            const remainingPhotos = entry.photos.length - 1;
                            const showMore = photoIndex === 1 && remainingPhotos > 1;
                            return (
                              <button
                                key={`${entry.id}-${photoIndex}`}
                                type="button"
                                data-image-viewer
                                data-image-src={photo.src}
                                data-image-alt={photo.alt}
                                data-image-gallery={JSON.stringify(entry.photos)}
                                data-image-index={photoIndex}
                                aria-haspopup="dialog"
                                aria-label={showMore ? `Ver ${remainingPhotos} fotos más de ${plant?.commonName}` : `Ampliar foto de ${plant?.commonName}`}
                                title={showMore ? "Ver todas las fotos" : "Ampliar foto"}
                                className="relative aspect-[4/3] w-full overflow-hidden bg-green-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
                              >
                                <img
                                  src={photo.src}
                                  alt={photo.alt}
                                  className={`size-full object-cover ${showMore ? "scale-105 blur-sm" : ""}`}
                                  loading="lazy"
                                />
                                {showMore ? (
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 px-2 text-center text-lg text-white">
                                    {remainingPhotos} fotos más
                                  </span>
                                ) : (
                                  <span aria-hidden="true" className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded bg-black/55 text-white">
                                    <ZoomIn size={18} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="min-h-72 border-b border-green-900/15 py-12 md:py-16">
              <div className="flex max-w-2xl gap-5">
                <span
                  aria-hidden="true"
                  className="mt-2 size-2 shrink-0 rounded-full bg-green-800"
                />
                <div>
                  <p className="text-sm text-green-700">
                    Diario de {selectedPlant ? selectedPlant.commonName : activeCategoryData.singular}
                  </p>
                  <h2 className="mt-2 text-2xl text-green-950">
                    Las primeras notas están por venir
                  </h2>
                  <p className="mt-3 leading-relaxed text-green-900">
                    Cuando documente una sesión{selectedPlant ? " de este árbol" : ""}, aparecerá aquí con su fecha,
                    el trabajo realizado y las fotos del proceso.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}