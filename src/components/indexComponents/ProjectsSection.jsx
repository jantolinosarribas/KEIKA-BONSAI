import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const photos = [
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(3).jpeg",
    alt: "Prebonsai de aguacate",
    label: "Aguacate",
    width: 3024,
    height: 4032,
  },
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM.jpeg",
    alt: "Prebonsai de pino negro japones",
    label: "Pino negro japones",
    width: 3024,
    height: 4032,
  },
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(1).jpeg",
    alt: "Prebonsai de arce japones",
    label: "Arce japones",
    width: 3024,
    height: 4032,
  },
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(2).jpeg",
    alt: "Prebonsai de higuera",
    label: "Higuera",
    width: 3024,
    height: 4032,
  },
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM%20(1).jpeg",
    alt: "Bonsai de olmo chino",
    label: "Bonsai Olmo Chino",
    width: 4032,
    height: 3024,
  },
  {
    src: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM.jpeg",
    alt: "Bonsai de enebro rastrero japones",
    label: "Bonsai Juniperus Procumbens Nana",
    width: 3024,
    height: 4032,
  }
];

export default function ProjectsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    slidesToScroll: 1,
  });
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const activePhoto = photos[activePhotoIndex];

  useEffect(() => {
    if (!emblaApi) return;

    const updateActivePhoto = () => {
      setActivePhotoIndex(emblaApi.selectedScrollSnap());
    };

    updateActivePhoto();
    emblaApi.on("select", updateActivePhoto);
    emblaApi.on("reInit", updateActivePhoto);

    return () => {
      emblaApi.off("select", updateActivePhoto);
      emblaApi.off("reInit", updateActivePhoto);
    };
  }, [emblaApi]);

  return (
    <section id="projects" className="projects-section relative isolate mt-30 w-full bg-zinc-900 py-32">
      <div className="flex justify-center mx-8">
        <span className="text-8xl bbh-sans-bogle-regular text-stone-100">
          FUTURE PROJECTS
        </span>
      </div>
      <div className="mx-6 mt-10 w-[calc(100vw-3rem)] max-w-6xl px-6 text-xl text-stone-100 md:mx-auto md:w-full md:px-10">
        <p>
          Estoy trabajando con prebonsáis y bonsáis. Estos son los ejemplares
          que forman parte de mi colección:
        </p>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-3xl bbh-sans-bogle-regular">Prebonsais</h2>
            <ul className="list-disc pl-6">
              <li>Pino negro japonés (<i>Pinus thunbergii</i>)</li>
              <li>Higuera (<i>Ficus carica</i>)</li>
              <li>Granado (<i>Punica granatum</i>)</li>
              <li>Aguacate (<i>Persea americana</i>)</li>
              <li>Olivo (<i>Olea europaea</i>)</li>
              <li>Falso ciprés (<i>Chamaecyparis</i> sp.)</li>
              <li>Arce japonés (<i>Acer palmatum</i>)</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-3xl bbh-sans-bogle-regular">Bonsais</h2>
            <ul className="list-disc pl-6">
              <li>Acebuche (<i>Olea europaea</i> var. <i>sylvestris</i>)</li>
              <li>Ginkgo o árbol de los cuarenta escudos (<i>Ginkgo biloba</i>)</li>
              <li>Olmo chino (<i>Ulmus parvifolia</i>)</li>
              <li>Enebro rastrero japonés (<i>Juniperus procumbens</i> 'Nana')</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="mb-2 text-3xl bbh-sans-bogle-regular">
            Cada arbol, su propio camino
          </h2>
          <p>
            Cada ejemplar forma parte de un proceso distinto. Poco a poco iré
            compartiendo su evolución y lo que voy aprendiendo con cada uno.
          </p>
          <div
            className="mt-8"
            role="region"
            aria-label="Fotos de mis arboles"
            aria-roledescription="carrusel"
          >
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="-ml-4 flex items-center touch-pan-y">
                {photos.map((photo, photoIndex) => (
                  <div
                    key={photo.src}
                    className="min-w-0 flex-[0_0_auto] pl-4"
                    role="group"
                    aria-label={`${photoIndex + 1} de ${photos.length}`}
                    aria-roledescription="diapositiva"
                  >
                    <div
                      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                      className="relative h-[68vh] min-h-80 max-h-[560px] w-auto max-w-[120vw] overflow-hidden md:max-w-[88vw]"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        className={`size-full object-cover transition-opacity duration-300 ${activePhotoIndex === photoIndex ? "opacity-100" : "opacity-45"}`}
                        loading={photoIndex === activePhotoIndex ? "eager" : "lazy"}
                        draggable="false"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stone-400 text-3xl leading-none transition-colors duration-200 hover:border-green-500 hover:bg-green-500 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400"
                aria-label="Mostrar foto anterior"
                title="Foto anterior"
              >
                ‹
              </button>
              <span aria-live="polite" aria-atomic="true" className="min-w-0 text-center">
                <span className="block truncate text-base">{activePhoto.label}</span>
                <span className="block text-sm text-stone-400">
                  {activePhotoIndex + 1} / {photos.length}
                </span>
              </span>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stone-400 text-3xl leading-none transition-colors duration-200 hover:border-green-500 hover:bg-green-500 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400"
                aria-label="Mostrar foto siguiente"
                title="Foto siguiente"
              >
                ›
              </button>
            </div>
            <div className="mt-5 flex gap-3 overflow-x-auto px-1 py-2 md:justify-center">
              {photos.map((photo, photoIndex) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(photoIndex)}
                  className={`size-16 shrink-0 overflow-hidden rounded-sm border transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400 ${photoIndex === activePhotoIndex ? "border-green-400 opacity-100" : "border-stone-600 opacity-55 hover:opacity-100"}`}
                  aria-label={`Mostrar ${photo.label}`}
                  aria-pressed={photoIndex === activePhotoIndex}
                  title={photo.label}
                >
                  <img
                    src={photo.src}
                    alt=""
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
          <a
            href="/work"
            className="group mt-8 inline-flex items-center gap-2 text-xl underline decoration-green-400 hover:decoration-green-200"
          >
            <span>Explora todos mis árboles y sus fichas...</span>
            <span
              aria-hidden="true"
              className="translate-x-[-0.25rem] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
