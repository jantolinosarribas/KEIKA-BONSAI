import { plants, type Plant } from "../data/plants";
import { journalEntries, type JournalEntry } from "../data/journalEntries";
import { hasPartialConfiguration, supabase } from "./supabase";

export async function getContent(): Promise<{ plants: Plant[]; journalEntries: JournalEntry[] }> {
  if (hasPartialConfiguration) {
    throw new Error("Falta una de las variables publicas de Supabase.");
  }
  if (!supabase) return { plants, journalEntries };

  const [plantResult, entryResult] = await Promise.all([
    supabase.from("plants").select("*").order("commonName"),
    supabase.from("journal_entries").select("*").order("date", { ascending: false }),
  ]);
  if (plantResult.error || entryResult.error) {
    throw new Error("No se pudo cargar el contenido de Supabase.", {
      cause: plantResult.error ?? entryResult.error,
    });
  }
  return {
    plants: plantResult.data as Plant[],
    journalEntries: entryResult.data.map((entry) => ({
      ...entry,
      dateLabel: new Intl.DateTimeFormat("es", { dateStyle: "long", timeZone: "UTC" })
        .format(new Date(`${entry.date}T12:00:00Z`)),
    })) as JournalEntry[],
  };
}