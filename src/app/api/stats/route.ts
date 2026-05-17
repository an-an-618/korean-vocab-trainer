import { recordStudyResult } from "@/lib/db";
import { findVocabularyEntry } from "@/lib/vocabulary";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { wordId?: string; correct?: boolean };
  if (!body.wordId || typeof body.correct !== "boolean") {
    return Response.json({ error: "wordId and correct are required." }, { status: 400 });
  }
  if (!findVocabularyEntry(body.wordId)) {
    return Response.json({ error: "Unknown wordId." }, { status: 400 });
  }

  await recordStudyResult(session.userId, body.wordId, body.correct);
  return Response.json({ ok: true });
}
