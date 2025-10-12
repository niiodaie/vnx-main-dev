// app/tools/src/api/notes.ts
import { Note } from "../types/note";

const API_BASE = "https://vnx-main-backend.onrender.com/tools/vnx-note-api";

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${API_BASE}/notes`);
  return res.json();
}

export async function createNote(note: { title: string; content: string }): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
  });
}
