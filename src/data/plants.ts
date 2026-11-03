export const categories = [
  { id: "prebonsais", label: "Prebonsáis" },
  { id: "bonsais", label: "Bonsáis" },
];

export interface Plant {
  id: string;
  category: string;
  commonName: string;
  scientificName: string;
  image?: string;
  description?: string;
  age?: string;
  cultivationTime?: string;
  origin?: string;
  location?: string;
  substrate?: string;
  futureDesign?: string;
}

export const plants: Plant[] = [
  {
    id: "pino-negro-japones-001",
    category: "prebonsais",
    commonName: "Pino negro japonés",
    scientificName: "Pinus thunbergii",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM.jpeg",
  },
  {
    id: "higuera-001",
    category: "prebonsais",
    commonName: "Higuera",
    scientificName: "Ficus carica",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(2).jpeg",
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
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(3).jpeg",
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
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.28.10%20PM%20(1).jpeg",
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
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM%20(1).jpeg",
  },
  {
    id: "enebro-rastrero-japones-001",
    category: "bonsais",
    commonName: "Enebro rastrero japonés",
    scientificName: "Juniperus procumbens 'Nana'",
    image: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM.jpeg",
  },
];