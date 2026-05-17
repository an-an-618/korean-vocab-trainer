import vocabularyJson from "@/data/vocabulary.json";
import type { VocabularyEntry } from "@/lib/types";

export const vocabulary = vocabularyJson as VocabularyEntry[];

export const lessons = Array.from(new Set(vocabulary.map((entry) => entry.lesson))).sort(
  (left, right) => Number.parseInt(left, 10) - Number.parseInt(right, 10),
);

export function getVocabularyByIds(ids: Set<string>) {
  return vocabulary.filter((entry) => ids.has(entry.id));
}

export function findVocabularyEntry(id: string) {
  return vocabulary.find((entry) => entry.id === id);
}
