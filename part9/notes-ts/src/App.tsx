import { useState } from "react";

interface Note {
  id: number;
  content: string;
}

const App = () => {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([{ id: 1, content: "testing" }]);

  const addNote = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <form>
        new note:{" "}
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          type="submit"
          onClick={(e) => {
            addNote(e);
          }}
        >
          submit
        </button>
      </form>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.content}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
