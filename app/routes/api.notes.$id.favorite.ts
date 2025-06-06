import { json, type ActionFunctionArgs } from "@remix-run/node";
import { toggleFavorite } from "~/services/notes.server";
import { requireUserId } from "~/services/session.server";

export async function action({ params, request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const noteId = parseInt(params.id || "", 10);

  if (isNaN(noteId)) {
    return json({ error: "Invalid note ID" }, { status: 400 });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const note = await toggleFavorite(noteId, userId);
    if (!note) {
      return json({ error: "Note not found" }, { status: 404 });
    }
    return json({ success: true, note });
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
} 