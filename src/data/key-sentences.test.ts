import { describe, expect, it } from "vitest";
import {
  getKeySentencesByLesson,
  keySentenceLessons,
  keySentences,
} from "@/data/key-sentences";

describe("key sentence data", () => {
  it("covers lessons 2 through 7", () => {
    expect(keySentenceLessons).toEqual(["2과", "3과", "4과", "5과", "6과", "7과"]);
  });

  it("contains Korean sentences for every lesson", () => {
    expect(keySentences.every((sentence) => sentence.korean && sentence.lesson)).toBe(true);
    expect(keySentenceLessons.every((lesson) => getKeySentencesByLesson(lesson).length > 0)).toBe(
      true,
    );
  });
});
