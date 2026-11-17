export const categories = [
  { id: "prebonsais", label: "Prebonsáis" },
  { id: "bonsais", label: "Bonsáis" },
];

export interface PlantPhoto {
  src: string;
  alt: string;
  date?: string | null;
}

export interface Plant {
  id: string;
  category: string;
  commonName: string;
  scientificName: string;
  image?: string;
  photos?: PlantPhoto[];
  description?: string;
  age?: string;
  cultivationTime?: string;
  origin?: string;
  location?: string;
  substrate?: string;
  futureDesign?: string;
}

function isPlantStorageUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return (url.protocol === "https:" || url.protocol === "http:")
      && /\/storage\/v1\/object\/public\/plant-photos\/[^/]+/.test(url.pathname);
  } catch {
    return false;
  }
}

export function getPlantPhotos(plant: Pick<Plant, "commonName" | "image" | "photos">): PlantPhoto[] {
  const photos = (plant.photos ?? []).filter((photo) => photo && typeof photo.src === "string" && isPlantStorageUrl(photo.src));
  if (photos.length) {
    return photos.map((photo) => ({
      src: photo.src,
      alt: photo.alt || plant.commonName,
      date: photo.date ?? null,
    }));
  }
  return plant.image && isPlantStorageUrl(plant.image)
    ? [{ src: plant.image, alt: plant.commonName, date: null }]
    : [];
}

export function formatPlantPhotoDate(date?: string | null): string {
  if (!date) return "Fecha no registrada";
  const parsedDate = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(parsedDate.getTime())) return "Fecha no registrada";
  return new Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" }).format(parsedDate);
}

export const plants: Plant[] = [
  {
    id: "pino-negro-japones-001",
    category: "prebonsais",
    commonName: "Pino negro japonés",
    scientificName: "Pinus thunbergii",
  },
  {
    id: "higuera-001",
    category: "prebonsais",
    commonName: "Higuera",
    scientificName: "Ficus carica",
  },
  {
    id: "granado-001",
    category: "prebonsais",
    commonName: "Granado",
    scientificName: "Punica granatum",
  },
  {
    id: "aguacate-001",
    category: "prebonsais",
    commonName: "Aguacate",
    scientificName: "Persea americana",
  },
  {
    id: "olivo-001",
    category: "prebonsais",
    commonName: "Olivo",
    scientificName: "Olea europaea",
  },
  {
    id: "falso-cipres-001",
    category: "prebonsais",
    commonName: "Falso ciprés",
    scientificName: "Chamaecyparis sp.",
  },
  {
    id: "arce-japones-001",
    category: "prebonsais",
    commonName: "Arce japonés",
    scientificName: "Acer palmatum",
  },
  {
    id: "acebuche-001",
    category: "bonsais",
    commonName: "Acebuche",
    scientificName: "Olea europaea var. sylvestris",
  },
  {
    id: "ginkgo-001",
    category: "bonsais",
    commonName: "Ginkgo",
    scientificName: "Ginkgo biloba",
  },
  {
    id: "olmo-chino-001",
    category: "bonsais",
    commonName: "Olmo chino",
    scientificName: "Ulmus parvifolia",
  },
  {
    id: "enebro-rastrero-japones-001",
    category: "bonsais",
    commonName: "Enebro rastrero japonés",
    scientificName: "Juniperus procumbens 'Nana'",
  },
];