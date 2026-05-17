import type { StudyDirection, VocabularyEntry } from "@/lib/types";

const punctuationPattern = /[\s,，.。;；:：!！?？、/\\\-—_'"“”‘’()[\]（）【】{}<>《》]/g;

export function normalizeKoreanAnswer(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeChineseAnswer(value: string) {
  return value.toLowerCase().replace(punctuationPattern, "");
}

export function splitMeaningCandidates(meaning: string) {
  const candidates = meaning
    .split(/[，,、;；/()（）]/g)
    .map(normalizeChineseAnswer)
    .filter(Boolean);

  const full = normalizeChineseAnswer(meaning);
  return Array.from(new Set([full, ...candidates].filter(Boolean)));
}

export function gradeAnswer(
  input: string,
  entry: VocabularyEntry,
  direction: StudyDirection,
) {
  if (direction === "cn-to-ko") {
    return normalizeKoreanAnswer(input) === normalizeKoreanAnswer(entry.word);
  }

  const normalizedInput = normalizeChineseAnswer(input);
  if (!normalizedInput) return false;

  return splitMeaningCandidates(entry.meaning).some((candidate) => {
    return candidate === normalizedInput || candidate.includes(normalizedInput);
  });
}

export function getPrompt(entry: VocabularyEntry, direction: StudyDirection) {
  return direction === "cn-to-ko" ? entry.meaning : entry.word;
}

export function getExpectedAnswer(entry: VocabularyEntry, direction: StudyDirection) {
  return direction === "cn-to-ko" ? entry.word : entry.meaning;
}
