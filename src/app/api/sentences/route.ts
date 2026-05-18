import {
  addCustomSentence,
  getCustomSentences,
  removeCustomSentence,
} from "@/lib/db";
import { keySentenceLessons } from "@/data/key-sentences";
import { getSession } from "@/lib/session";

const MAX_SENTENCE_LENGTH = 300;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sentences = await getCustomSentences(session.userId);
  return Response.json({ sentences });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    lesson?: string;
    korean?: string;
    chinese?: string;
  };
  const lesson = normalizeText(body.lesson);
  const korean = normalizeText(body.korean);
  const chinese = normalizeText(body.chinese);

  if (!keySentenceLessons.includes(lesson)) {
    return Response.json({ error: "Unknown lesson." }, { status: 400 });
  }
  if (!korean || !chinese) {
    return Response.json({ error: "Korean and Chinese sentences are required." }, { status: 400 });
  }
  if (korean.length > MAX_SENTENCE_LENGTH || chinese.length > MAX_SENTENCE_LENGTH) {
    return Response.json({ error: "Sentence is too long." }, { status: 400 });
  }

  const sentence = await addCustomSentence(session.userId, {
    lesson,
    korean,
    chinese,
  });
  return Response.json({ sentence }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  const id = normalizeText(body.id);
  if (!id) {
    return Response.json({ error: "id is required." }, { status: 400 });
  }

  await removeCustomSentence(session.userId, id);
  return Response.json({ ok: true });
}
