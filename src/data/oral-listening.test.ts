import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { oralListeningCards } from "@/data/oral-listening";

describe("oral listening practice data", () => {
  it("contains every detected teacher audio slice", () => {
    expect(oralListeningCards).toHaveLength(45);
  });

  it("maps slices back to the 40 sample questions", () => {
    const sampleNumbers = new Set(oralListeningCards.map((card) => card.sampleQuestionNumber));
    expect(sampleNumbers.size).toBe(40);
    expect(oralListeningCards[0].question).toBe("어느 나라 사람이에요?");
    expect(oralListeningCards.at(-1)?.question).toBe("집에서 학교까지 얼마나 걸려요?");
  });

  it("keeps all card fields complete", () => {
    expect(
      oralListeningCards.every(
        (card) => card.id && card.question && card.answer && card.audioSrc,
      ),
    ).toBe(true);
  });

  it("ships every referenced audio file", () => {
    const root = process.cwd();
    for (const card of oralListeningCards) {
      const audioPath = path.join(root, "public", card.audioSrc.replace(/^\//, ""));
      expect(existsSync(audioPath), `${card.id} missing ${card.audioSrc}`).toBe(true);
    }
  });
});
