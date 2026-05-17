import { describe, expect, it } from "vitest";
import { lessons, vocabulary } from "@/lib/vocabulary";

describe("vocabulary data", () => {
  it("imports all Sheet1 entries", () => {
    expect(vocabulary).toHaveLength(520);
  });

  it("contains the required public fields", () => {
    expect(
      vocabulary.every((entry) => entry.word && entry.meaning && entry.lesson),
    ).toBe(true);
  });

  it("covers lessons 2 through 9", () => {
    expect(lessons).toEqual(["2과", "3과", "4과", "5과", "6과", "7과", "8과", "9과"]);
  });
});
