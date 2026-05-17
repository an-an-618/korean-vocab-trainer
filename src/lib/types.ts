export type VocabularyEntry = {
  id: string;
  word: string;
  hanja: string;
  pronunciation: string;
  partOfSpeech: string;
  meaning: string;
  lesson: string;
  source: string;
  note: string;
};

export type StudyMode = "all" | "lesson" | "wordbook";

export type StudyDirection = "cn-to-ko" | "ko-to-cn";

export type StudyStat = {
  wordId: string;
  correctCount: number;
  wrongCount: number;
  lastSeenAt: string | null;
};

export type WordbookItem = {
  wordId: string;
  note: string;
  createdAt: string;
};

export type ProgressPayload = {
  wordbook: WordbookItem[];
  stats: StudyStat[];
};
