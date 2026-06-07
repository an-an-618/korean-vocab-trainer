import { describe, expect, it } from "vitest";
import {
  getOralExamQuestionsByLesson,
  oralExamLessons,
  oralExamQuestions,
} from "@/data/oral-exam";

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

describe("oral exam question data", () => {
  it("contains expanded question-answer cards for each lesson", () => {
    expect(oralExamQuestions).toHaveLength(168);
    for (const lesson of oralExamLessons) {
      expect(getOralExamQuestionsByLesson(lesson).length).toBeGreaterThanOrEqual(21);
    }
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
    expect(getOralExamQuestionsByLesson("8과")).toHaveLength(21);
    expect(getOralExamQuestionsByLesson("8과").every((question) => question.lesson === "8과")).toBe(
      true,
    );
  });
});
