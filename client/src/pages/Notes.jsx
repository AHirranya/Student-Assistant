import { useEffect, useState } from "react";
import API from "../services/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const backendBaseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  const [form, setForm] = useState({
    subject_name: "",
    topic_name: "",
    note_content: "",
    completed: false,
    note_pdf: null,
  });

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setMessage("");

    if (e.target.type === "file") {
      setForm({ ...form, note_pdf: e.target.files[0] });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("subject_name", form.subject_name);
      formData.append("topic_name", form.topic_name);
      formData.append("note_content", form.note_content);
      formData.append("completed", form.completed);

      if (form.note_pdf) {
        formData.append("note_pdf", form.note_pdf);
      }

      await API.post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        subject_name: "",
        topic_name: "",
        note_content: "",
        completed: false,
        note_pdf: null,
      });

      e.target.reset();
      fetchNotes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Note save failed.");
    }
  };

  const toggleCompleted = async (note) => {
    await API.put(`/notes/${note.id}`, {
      subject_name: note.subject_name,
      topic_name: note.topic_name,
      note_content: note.note_content,
      completed: !note.completed,
    });

    fetchNotes();
  };

  const handleDelete = async (id) => {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  };

  const filteredNotes = notes.filter((note) => {
    return (
      note.subject_name.toLowerCase().includes(search.toLowerCase()) ||
      note.topic_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <h1>Notes Organizer</h1>
      <p className="sub-text">
        Save text notes and upload PDF notes subject-wise.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <input
          type="text"
          name="subject_name"
          placeholder="Subject Name"
          value={form.subject_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="topic_name"
          placeholder="Topic Name"
          value={form.topic_name}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="note_pdf"
          accept="application/pdf"
          onChange={handleChange}
        />

        <textarea
          name="note_content"
          placeholder="Write notes here"
          value={form.note_content}
          onChange={handleChange}
        />

        <button type="submit">Add Note</button>
      </form>

      <input
        className="search-box"
        type="text"
        placeholder="Search by subject or topic"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="cards-grid">
        {filteredNotes.map((note) => (
          <div className="card" key={note.id}>
            <h3>{note.topic_name}</h3>
            <p>
              <strong>Subject:</strong> {note.subject_name}
            </p>
            <p>{note.note_content}</p>

            {note.pdf_url && (
              <a href={`${backendBaseUrl}${note.pdf_url}`} target="_blank">
                View PDF
              </a>
            )}

            <br />
            <br />

            <span className={note.completed ? "badge safe" : "badge danger"}>
              {note.completed ? "Completed" : "Pending"}
            </span>

            <br />
            <br />

            <button className="small-btn" onClick={() => toggleCompleted(note)}>
              Mark {note.completed ? "Pending" : "Completed"}
            </button>

            <button
              className="small-btn delete"
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}

export default Notes;