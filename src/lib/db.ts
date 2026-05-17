import postgres from "postgres";
import type { ProgressPayload } from "@/lib/types";

let sqlClient: ReturnType<typeof postgres> | null = null;

function getDatabaseUrl() {
  return process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
}

export function getSql() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    throw new Error("POSTGRES_URL or DATABASE_URL is required for cloud sync.");
  }

  sqlClient ??= postgres(databaseUrl, {
    max: 3,
    prepare: false,
  });

  return sqlClient;
}

export async function upsertUser(input: {
  vercelUserId: string;
  email?: string;
  name?: string;
}) {
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    insert into users (vercel_user_id, email, name)
    values (${input.vercelUserId}, ${input.email ?? null}, ${input.name ?? null})
    on conflict (vercel_user_id)
    do update set email = excluded.email, name = excluded.name
    returning id
  `;

  return rows[0].id;
}

export async function getProgress(userId: string): Promise<ProgressPayload> {
  const sql = getSql();
  const [wordbookRows, statRows] = await Promise.all([
    sql<{ word_id: string; note: string | null; created_at: Date }[]>`
      select word_id, note, created_at
      from wordbook_items
      where user_id = ${userId}
      order by created_at desc
    `,
    sql<{
      word_id: string;
      correct_count: number;
      wrong_count: number;
      last_seen_at: Date | null;
    }[]>`
      select word_id, correct_count, wrong_count, last_seen_at
      from study_stats
      where user_id = ${userId}
    `,
  ]);

  return {
    wordbook: wordbookRows.map((row) => ({
      wordId: row.word_id,
      note: row.note ?? "",
      createdAt: row.created_at.toISOString(),
    })),
    stats: statRows.map((row) => ({
      wordId: row.word_id,
      correctCount: row.correct_count,
      wrongCount: row.wrong_count,
      lastSeenAt: row.last_seen_at?.toISOString() ?? null,
    })),
  };
}

export async function addWordbookItem(userId: string, wordId: string, note = "") {
  const sql = getSql();
  await sql`
    insert into wordbook_items (user_id, word_id, note)
    values (${userId}, ${wordId}, ${note})
    on conflict (user_id, word_id)
    do update set note = excluded.note
  `;
}

export async function removeWordbookItem(userId: string, wordId: string) {
  const sql = getSql();
  await sql`
    delete from wordbook_items
    where user_id = ${userId} and word_id = ${wordId}
  `;
}

export async function recordStudyResult(userId: string, wordId: string, correct: boolean) {
  const sql = getSql();
  await sql`
    insert into study_stats (user_id, word_id, correct_count, wrong_count, last_seen_at)
    values (${userId}, ${wordId}, ${correct ? 1 : 0}, ${correct ? 0 : 1}, now())
    on conflict (user_id, word_id)
    do update set
      correct_count = study_stats.correct_count + ${correct ? 1 : 0},
      wrong_count = study_stats.wrong_count + ${correct ? 0 : 1},
      last_seen_at = now()
  `;
}
