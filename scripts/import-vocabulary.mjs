import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import xlsx from "xlsx";

const sourcePath = process.argv[2] ?? process.env.VOCAB_SOURCE_PATH;
const outputPath = path.join(process.cwd(), "src", "data", "vocabulary.json");

if (!sourcePath) {
  throw new Error(
    "Please provide a vocabulary workbook path: npm run import:vocab -- \"D:\\path\\to\\vocabulary.xlsx\"",
  );
}

function clean(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function makeId(row) {
  const lesson = clean(row["课"]).replace(/\s+/g, "");
  const word = clean(row["词汇"]).replace(/\s+/g, "-");
  const meaning = clean(row["词义"]).replace(/\s+/g, "-").slice(0, 28);
  return `${lesson}-${word}-${meaning}`;
}

const workbook = xlsx.readFile(sourcePath);
const sheet = workbook.Sheets.Sheet1;
if (!sheet) {
  throw new Error("Sheet1 was not found in the workbook.");
}

const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
const vocabulary = rows
  .filter((row) => clean(row["词汇"]) && clean(row["词义"]) && clean(row["课"]))
  .map((row, index) => ({
    id: `${String(index + 1).padStart(3, "0")}-${makeId(row)}`,
    word: clean(row["词汇"]),
    hanja: clean(row["汉字词/外来词"]),
    pronunciation: clean(row["发音"]),
    partOfSpeech: clean(row["词性"]) || "词性未标注",
    meaning: clean(row["词义"]),
    lesson: clean(row["课"]),
    source: clean(row["出处"]),
    note: clean(row["备注"]),
  }));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(vocabulary, null, 2)}\n`, "utf8");

console.log(`Imported ${vocabulary.length} vocabulary entries to ${outputPath}`);
