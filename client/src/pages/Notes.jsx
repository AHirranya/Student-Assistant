import { useEffect, useState } from "react";
import API from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);

  const [form, setForm] = useState({
    subject_name: "",
    topic_name: "",
    note_content: "",
    completed: false,
  });

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addNote = async (e) => {
    e.preventDefault();

    await API.post("/notes", form);

    setForm({
      subject_name: "",
      topic_name: "",
      note_content: "",
      completed: false,
    });

    fetchNotes();
  };

  const toggleNote = async (note) => {
    await API.put(`/notes/${note.id}`, {
      ...note,
      completed: !note.completed,
    });

    fetchNotes();
  };

  const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div>
      <h1>Notes Organizer</h1>
      <p className="sub-text">Save subject-wise notes.</p>

      <form className="form-card" onSubmit={addNote}>
        <input
          name="subject_name"
          placeholder="Subject"
          value={form.subject_name}
          onChange={handleChange}
          required
        />

        <input
          name="topic_name"
          placeholder="Topic"
          value={form.topic_name}
          onChange={handleChange}
          required
        />

        <textarea
          name="note_content"
          placeholder="Notes"
          value={form.note_content}
          onChange={handleChange}
        />

        <button>Add Note</button>
      </form>

      <div className="cards-grid">
        {notes.map((note) => (
          <div className="card" key={note.id}>
            <h3>{note.topic_name}</h3>
            <p>
              <strong>Subject:</strong> {note.subject_name}
            </p>
            <p>{note.note_content}</p>

            <span className={note.completed ? "badge safe" : "badge danger"}>
              {note.completed ? "Completed" : "Pending"}
            </span>

            <br />
            <br />

            <button className="small-btn" onClick={() => toggleNote(note)}>
              Mark {note.completed ? "Pending" : "Completed"}
            </button>

            <button
              className="small-btn delete"
              onClick={() => deleteNote(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;