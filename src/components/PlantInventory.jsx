import { useRef, useState } from "react";
import { ChevronDown, Sprout, ZoomIn } from "lucide-react";
import { categories, plants as initialPlants } from "../data/plants";

export default function PlantInventory({ plants = initialPlants }) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const tabRefs = useRef([]);
  const activeCategoryIndex = categories.findIndex(
    (category) => category.id === activeCategory,
  );
  const visiblePlants = plants.filter(
    (plant) => plant.category === activeCategory,
  );

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
      <div className="mx-auto max-w-6xl">
        <div
          className="flex gap-7 border-b border-green-900/20"
          role="tablist"
          aria-label="Filtrar árboles por tipo"
        >
          {categories.map((category, index) => {
            const isSelected = category.id === activeCategory;
            const count = plants.filter(
              (plant) => plant.category === category.id,
            ).length;

            return (
              <button
                key={category.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`inventory-tab-${category.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={`inventory-panel-${category.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveCategory(category.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`border-b-2 px-1 pb-3 text-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 ${isSelected ? "border-green-800 text-green-900" : "border-transparent text-green-900/55 hover:text-green-800"}`}
              >
                {category.label} <span className="text-sm">{count}</span>
              </button>
            );
          })}
        </div>

        <div
          id={`inventory-panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`inventory-tab-${activeCategory}`}
          tabIndex={0}
          className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
        >
          <div className="grid items-start gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlants.map((plant) => (
              <details
                key={plant.id}
                className="plant-details group min-w-0 overflow-hidden rounded-lg border border-green-900/15 bg-white/30"
              >
                <summary className="list-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-700 [&::-webkit-details-marker]:hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-green-900/5">
                    {plant.image ? (
                      <>
                        <img
                          src={plant.image}
                          alt={plant.commonName}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          data-image-viewer
                          data-image-src={plant.image}
                          data-image-alt={plant.commonName}
                          aria-haspopup="dialog"
                          aria-label={`Ampliar foto de ${plant.commonName}`}
                          title={`Ampliar foto de ${plant.commonName}`}
                          className="absolute right-3 bottom-3 flex size-11 items-center justify-center rounded bg-black/55 text-white hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                          <ZoomIn size={18} aria-hidden="true" />
                        </button>
                      </>
                    ) : (
                      <div className="flex size-full flex-col items-center justify-center gap-3 text-green-900/45">
                        <Sprout aria-hidden="true" size={30} strokeWidth={1.4} />
                        <span className="text-sm">Foto pendiente</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4 p-5">
                    <span className="min-w-0">
                      <span className="mb-1 block text-sm text-green-700">
                        {categories[activeCategoryIndex].label.slice(0, -1)}
                      </span>
                      <a
                        href={`/arbolario/${plant.id}`}
                        className="block text-xl text-green-950 underline decoration-green-800/30 underline-offset-4 hover:decoration-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
                      >
                        {plant.commonName}
                      </a>
                      <span className="mt-1 block text-sm italic text-green-900/70">
                        {plant.scientificName}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                      size={20}
                    />
                  </div>
                </summary>
                <div className="border-t border-green-900/15 px-5 py-4">
                  <dl className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-green-700">Edad / tiempo en cultivo</dt>
                      <dd className="mt-1 text-green-950">{plant.age ?? plant.cultivationTime ?? "Por documentar"}</dd>
                    </div>
                    <div>
                      <dt className="text-green-700">Diseño futuro</dt>
                      <dd className="mt-1 text-green-950">{plant.futureDesign ?? "Por definir"}</dd>
                    </div>
                  </dl>
                  <a
                    href={`/arbolario/${plant.id}#diario`}
                    className="mt-5 inline-flex items-center gap-2 text-sm text-green-800 underline decoration-green-800/40 underline-offset-4 hover:decoration-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
                  >
                    Ver diario de este árbol
                  </a>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}