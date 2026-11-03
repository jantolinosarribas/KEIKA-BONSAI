export interface JournalEntry {
  id: string;
  plantId: string;
  date: string;
  dateLabel: string;
  title: string;
  description: string;
  isMock?: boolean;
  observation?: string;
  nextStep?: string;
  photos?: { src: string; alt: string }[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: "olmo-chino-alambrado-ejemplo-2026-11-03",
    plantId: "olmo-chino-001",
    date: "2026-11-03",
    dateLabel: "3 de noviembre de 2026",
    title: "Una mañana de alambrado",
    description:
      "Esta mañana hemos alambrado el olmo chino con calma, buscando abrir un poco la copa y dar movimiento a las ramas principales. Hemos ido ajustando cada curva para que las ramas tengan su espacio y la silueta se vea más equilibrada. Ahora toca dejarlo descansar y observar cómo evoluciona durante las próximas semanas.",
    isMock: true,
    photos: [1, 2, 3, 4].map((view) => ({
      src: "/WhatsApp%20Image%202026-11-03%20at%2012.52.23%20PM%20(1).jpeg",
      alt: `Olmo chino, foto de ejemplo ${view}`,
    })),
  },
];