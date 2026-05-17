import { describe, expect, it } from "vitest";
import { gradeAnswer } from "@/lib/grading";
import type { VocabularyEntry } from "@/lib/types";

const entry: VocabularyEntry = {
  id: "test",
  word: "선생님",
  hanja: "",
  pronunciation: "",
  partOfSpeech: "名词",
  meaning: "老师，教师",
  lesson: "2과",
  source: "教材",
  note: "",
};

describe("gradeAnswer", () => {
  it("accepts a partial Chinese meaning candidate", () => {
    expect(gradeAnswer("老师", entry, "ko-to-cn")).toBe(true);
  });

  it("ignores Korean leading and trailing whitespace", () => {
    expect(gradeAnswer("  선생님  ", entry, "cn-to-ko")).toBe(true);
  });

  it("rejects unrelated answers", () => {
    expect(gradeAnswer("学生", entry, "ko-to-cn")).toBe(false);
  });
});
