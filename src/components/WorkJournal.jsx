import { useEffect, useRef, useState } from "react";

const categories = [
  { id: "prebonsais", label: "Prebonsais", singular: "prebonsáis" },
  { id: "bonsais", label: "Bonsais", singular: "bonsáis" },
];

const journalEntries = {
  prebonsais: [],
  bonsais: [],
};

export default function WorkJournal() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const tabRefs = useRef([]);

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
  const entries = journalEntries[activeCategory];

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
    <section className="w-full px-6 pb-32 md:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="max-w-2xl text-lg leading-relaxed text-green-900">
          Cada árbol lleva su propio ritmo. Aquí iré anotando las sesiones por
          fecha: qué hice, qué observé y cómo continúa el proceso.
        </p>

        <div
          className="mt-10 flex gap-7 border-b border-green-900/20"
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

        <div
          id={`panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeCategory}`}
          tabIndex={0}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
        >
          {entries.length > 0 ? (
            <ol className="divide-y divide-green-900/15">
              {entries.map((entry) => (
                <li key={entry.id} className="py-10">
                  <article>
                    <time
                      dateTime={entry.date}
                      className="text-sm text-green-700"
                    >
                      {entry.dateLabel}
                    </time>
                    <h2 className="mt-2 text-2xl text-green-950">
                      {entry.plantName}
                    </h2>
                    <p className="mt-1 text-sm italic text-green-900/70">
                      {entry.scientificName}
                    </p>
                    <h3 className="mt-6 text-lg font-medium text-green-900">
                      {entry.title}
                    </h3>
                    <p className="mt-2 max-w-3xl leading-relaxed text-green-900">
                      {entry.description}
                    </p>
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
                    {entry.photos?.length > 0 && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {entry.photos.map((photo) => (
                          <img
                            key={photo.src}
                            src={photo.src}
                            alt={photo.alt}
                            className="h-auto w-full object-cover"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                  </article>
                </li>
              ))}
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
                    Diario de {activeCategoryData.singular}
                  </p>
                  <h2 className="mt-2 text-2xl text-green-950">
                    Las primeras notas están por venir
                  </h2>
                  <p className="mt-3 leading-relaxed text-green-900">
                    Cuando documente una sesión, aparecerá aquí con su fecha,
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