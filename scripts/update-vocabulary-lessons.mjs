import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import xlsx from "xlsx";

const sourcePath = process.argv[2] ?? process.env.VOCAB_SOURCE_PATH;
const vocabularyPath = path.join(process.cwd(), "src", "data", "vocabulary.json");

if (!sourcePath) {
  throw new Error("Please provide a workbook path.");
}

function clean(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function makeBaseId(entry, index) {
  const lesson = clean(entry.lesson).replace(/\s+/g, "");
  const word = clean(entry.word).replace(/\s+/g, "-");
  const meaning = clean(entry.meaning).replace(/\s+/g, "-").slice(0, 28);
  return `${String(index + 1).padStart(3, "0")}-${lesson}-${word}-${meaning}`;
}

function uniqueByKey(entries, getKey) {
  const groups = new Map();
  for (const entry of entries) {
    const key = getKey(entry);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }

  return new Map(
    [...groups.entries()].filter(([, values]) => values.length === 1).map(([key, values]) => [
      key,
      values[0],
    ]),
  );
}

function fullKey(entry) {
  return `${entry.lesson}\t${entry.word}\t${entry.meaning}`;
}

function lessonWordKey(entry) {
  return `${entry.lesson}\t${entry.word}`;
}

const workbook = xlsx.readFile(sourcePath);
const sheet = workbook.Sheets.Sheet1 ?? workbook.Sheets[workbook.SheetNames[0]];
if (!sheet) {
  throw new Error("No worksheet was found in the workbook.");
}

const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
const incoming = rows
  .filter((row) => clean(row["词汇"]) && clean(row["词义"]) && clean(row["课"]))
  .map((row) => ({
    id: "",
    word: clean(row["词汇"]),
    hanja: clean(row["汉字词/外来词"]),
    pronunciation: clean(row["发音"]),
    partOfSpeech: clean(row["词性"]) || "词性未标注",
    meaning: clean(row["词义"]),
    lesson: clean(row["课"]),
    source: clean(row["出处"]),
    note: clean(row["备注"]),
  }));

const lessonsToReplace = new Set(incoming.map((entry) => entry.lesson));
const current = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));
const oldInScope = current.filter((entry) => lessonsToReplace.has(entry.lesson));
const oldOutsideScope = current.filter((entry) => !lessonsToReplace.has(entry.lesson));
const oldByFullKey = uniqueByKey(oldInScope, fullKey);
const oldByLessonWord = uniqueByKey(oldInScope, lessonWordKey);
const incomingByLessonWord = uniqueByKey(incoming, lessonWordKey);

const updatedInScope = incoming.map((entry) => {
  const exact = oldByFullKey.get(fullKey(entry));
  const sameLessonWord =
    incomingByLessonWord.has(lessonWordKey(entry)) && oldByLessonWord.get(lessonWordKey(entry));
  return {
    ...entry,
    id: exact?.id ?? sameLessonWord?.id ?? "",
  };
});

const combined = [...updatedInScope, ...oldOutsideScope];
const usedIds = new Set(combined.filter((entry) => entry.id).map((entry) => entry.id));

for (const [index, entry] of combined.entries()) {
  if (entry.id) continue;

  let candidate = makeBaseId(entry, index);
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${makeBaseId(entry, index)}-${suffix}`;
    suffix += 1;
  }
  entry.id = candidate;
  usedIds.add(candidate);
}

fs.writeFileSync(vocabularyPath, `${JSON.stringify(combined, null, 2)}\n`, "utf8");

console.log(
  `Updated ${updatedInScope.length} entries for ${[...lessonsToReplace].join(", ")}; total ${combined.length}.`,
);
