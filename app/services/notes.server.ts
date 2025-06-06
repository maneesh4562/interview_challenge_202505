import { db, notes, type Note, type NewNote } from "~/db/schema";
import { sql } from "drizzle-orm";

export async function createNote(data: NewNote): Promise<Note> {
  const [note] = await db.insert(notes).values(data).returning();
  return note;
}

export async function getNoteById(id: number): Promise<Note | null> {
  const [note] = await db
    .select()
    .from(notes)
    .where(sql`${notes.id} = ${id}`);
  return note || null;
}

export async function getNotesByUserId(
  userId: number,
  { page = 1, perPage = 20 }: { page?: number; perPage?: number } = {}
): Promise<{ notes: Note[]; total: number }> {
  const offset = (page - 1) * perPage;
  
  const [notesList, totalCount] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(sql`${notes.userId} = ${userId}`)
      .orderBy(sql`${notes.favorite} DESC, ${notes.createdAt} DESC`)
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(sql`${notes.userId} = ${userId}`)
  ]);

  return {
    notes: notesList,
    total: Number(totalCount[0].count)
  };
}

export async function updateNote(
  id: number,
  userId: number,
  data: Partial<NewNote>
): Promise<Note | null> {
  const [note] = await db
    .update(notes)
    .set(data)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return note || null;
}

export async function deleteNote(id: number, userId: number): Promise<boolean> {
  const [note] = await db
    .delete(notes)
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return !!note;
}

export async function toggleFavorite(id: number, userId: number): Promise<Note | null> {
  const [note] = await db
    .update(notes)
    .set({ favorite: sql`NOT ${notes.favorite}` })
    .where(sql`${notes.id} = ${id} AND ${notes.userId} = ${userId}`)
    .returning();
  return note || null;
}
