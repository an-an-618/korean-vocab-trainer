import { describe, expect, it } from "vitest";
import {
  getKeySentencesByLesson,
  keySentenceLessons,
  keySentences,
} from "@/data/key-sentences";

describe("key sentence data", () => {
  it("covers lessons 2 through 9", () => {
    expect(keySentenceLessons).toEqual([
      "2과",
      "3과",
      "4과",
      "5과",
      "6과",
      "7과",
      "8과",
      "9과",
    ]);
  });

  it("contains Korean sentences for every lesson", () => {
    expect(keySentences.every((sentence) => sentence.korean && sentence.lesson)).toBe(true);
    expect(keySentenceLessons.every((lesson) => getKeySentencesByLesson(lesson).length > 0)).toBe(
      true,
    );
  });

  it("includes the new lesson 8 and 9 summaries", () => {
    expect(getKeySentencesByLesson("8과").some((sentence) => sentence.korean.includes("어디에 있어요"))).toBe(true);
    expect(getKeySentencesByLesson("9과").some((sentence) => sentence.korean.includes("바꿔 주세요"))).toBe(true);
  });
});
