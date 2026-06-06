import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  getOralExamQuestionsByLesson,
  oralExamLessons,
  oralExamQuestions,
} from "@/data/oral-exam";

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

describe("oral exam question data", () => {
  it("contains the planned 60 question-answer cards", () => {
    expect(oralExamQuestions).toHaveLength(60);
  });

  it("deduplicates question-answer pairs", () => {
    const pairs = oralExamQuestions.map((question) =>
      normalize(`${question.question}::${question.answer}`),
    );
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("covers lessons 2 through 9", () => {
    expect(oralExamLessons).toEqual([
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

  it("contains complete fields for every card", () => {
    expect(
      oralExamQuestions.every(
        (question) =>
          question.id &&
          question.lesson &&
          question.question &&
          question.answer &&
          question.focus,
      ),
    ).toBe(true);
  });

  it("can filter cards by lesson", () => {
    expect(getOralExamQuestionsByLesson("8과")).toHaveLength(11);
    expect(getOralExamQuestionsByLesson("8과").every((question) => question.lesson === "8과")).toBe(
      true,
    );
  });

  it("attaches teacher audio to the 40 sample questions", () => {
    const sampleQuestions = oralExamQuestions.slice(0, 40);
    expect(sampleQuestions.every((question) => question.questionAudioSrc)).toBe(true);
    expect(oralExamQuestions.filter((question) => question.questionAudioSrc)).toHaveLength(40);
    expect(sampleQuestions[0].question).toBe("어느 나라 사람이에요?");
    expect(sampleQuestions[39].question).toBe("집에서 학교까지 얼마나 걸려요?");
  });

  it("ships the referenced teacher audio files", () => {
    const root = process.cwd();
    for (const question of oralExamQuestions.filter((item) => item.questionAudioSrc)) {
      const audioPath = path.join(root, "public", question.questionAudioSrc!.replace(/^\//, ""));
      expect(existsSync(audioPath), `${question.id} missing ${question.questionAudioSrc}`).toBe(
        true,
      );
    }
  });
});
