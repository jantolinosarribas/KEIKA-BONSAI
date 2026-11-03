import { useRef, useState } from "react";
import { ChevronDown, Sprout } from "lucide-react";

const categories = [
  { id: "prebonsais", label: "Prebonsáis" },
  { id: "bonsais", label: "Bonsáis" },
];

const plants = [
  {
    category: "prebonsais",
    commonName: "Pino negro japonés",
    scientificName: "Pinus thunbergii",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM.jpeg",
  },
  {
    category: "prebonsais",
    commonName: "Higuera",
    scientificName: "Ficus carica",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(2).jpeg",
  },
  {
    category: "prebonsais",
    commonName: "Granado",
    scientificName: "Punica granatum",
  },
  {
    category: "prebonsais",
    commonName: "Aguacate",
    scientificName: "Persea americana",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(3).jpeg",
  },
  {
    category: "prebonsais",
    commonName: "Olivo",
    scientificName: "Olea europaea",
  },
  {
    category: "prebonsais",
    commonName: "Falso ciprés",
    scientificName: "Chamaecyparis sp.",
  },
  {
    category: "prebonsais",
    commonName: "Arce japonés",
    scientificName: "Acer palmatum",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(1).jpeg",
  },
  {
    category: "bonsais",
    commonName: "Acebuche",
    scientificName: "Olea europaea var. sylvestris",
  },
  {
    category: "bonsais",
    commonName: "Ginkgo",
    scientificName: "Ginkgo biloba",
  },
  {
    category: "bonsais",
    commonName: "Olmo chino",
    scientificName: "Ulmus parvifolia",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM%20(1).jpeg",
  },
  {
    category: "bonsais",
    commonName: "Enebro rastrero japonés",
    scientificName: "Juniperus procumbens 'Nana'",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM.jpeg",
  },
];

export default function PlantInventory() {
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
        <p className="max-w-2xl text-lg leading-relaxed text-green-900">
          Cada árbol tiene su propia historia. Aquí puedes conocer los
          ejemplares que forman mi colección y consultar los detalles que voy
          descubriendo con el tiempo.
        </p>

        <div
          className="mt-10 flex gap-7 border-b border-green-900/20"
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
          <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePlants.map((plant) => (
              <details
                key={plant.scientificName}
                className="group min-w-0 border border-green-900/15 bg-white/30"
              >
                <summary className="list-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700 [&::-webkit-details-marker]:hidden">
                  <div className="relative aspect-[4/3] overflow-hidden bg-green-900/5">
                    {plant.image ? (
                      <img
                        src={plant.image}
                        alt={plant.commonName}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
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
                      <span className="block text-xl text-green-950">
                        {plant.commonName}
                      </span>
                      <span className="mt-1 block text-sm italic text-green-900/70">
                        {plant.scientificName}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 shrink-0 transition-transform group-open:rotate-180"
                      size={20}
                    />
                  </div>
                </summary>
                <div className="border-t border-green-900/15 px-5 py-4">
                  <dl className="grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-green-700">Edad / tiempo en cultivo</dt>
                      <dd className="mt-1 text-green-950">Por documentar</dd>
                    </div>
                    <div>
                      <dt className="text-green-700">Diseño futuro</dt>
                      <dd className="mt-1 text-green-950">Por definir</dd>
                    </div>
                  </dl>
                  <a
                    href={`/blog?categoria=${plant.category}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm text-green-800 underline decoration-green-800/40 underline-offset-4 hover:decoration-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700"
                  >
                    Ver diario de {plant.category === "prebonsais" ? "prebonsáis" : "bonsáis"}
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