import { useEffect, useState } from "react";
import { fetchNotes } from "./api/notes";
import { Note } from "./types/note";

export default function NotesComponent() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes().then(setNotes);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notes ({notes.length})</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="mb-2 border p-2 rounded">
            <strong>{note.title}</strong>
            <p>{note.content}</p>
            <small className="text-gray-500">{note.date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
