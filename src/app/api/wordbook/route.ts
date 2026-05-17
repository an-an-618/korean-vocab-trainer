import { addWordbookItem, removeWordbookItem } from "@/lib/db";
import { findVocabularyEntry } from "@/lib/vocabulary";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    wordId?: string;
    action?: "add" | "remove";
    note?: string;
  };

  if (!body.wordId || !body.action) {
    return Response.json({ error: "wordId and action are required." }, { status: 400 });
  }
  if (!findVocabularyEntry(body.wordId)) {
    return Response.json({ error: "Unknown wordId." }, { status: 400 });
  }

  if (body.action === "add") {
    await addWordbookItem(session.userId, body.wordId, body.note ?? "");
  } else {
    await removeWordbookItem(session.userId, body.wordId);
  }

  return Response.json({ ok: true });
}
