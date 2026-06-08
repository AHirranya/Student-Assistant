import { useEffect, useState } from "react";
import API from "../services/api";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    description: "",
    reminder_date: "",
    reminder_time: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await API.get("/reminders");
      setReminders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.reminder_date < today) {
      setMessage("Reminder date cannot be in the past.");
      return;
    }

    try {
      if (editId) {
        await API.put(`/reminders/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/reminders", form);
      }

      setForm({
        title: "",
        description: "",
        reminder_date: "",
        reminder_time: "",
      });

      fetchReminders();
    } catch (error) {
      setMessage(error.response?.data?.message || "Reminder save failed.");
    }
  };

  const handleEdit = (reminder) => {
    setEditId(reminder.id);

    setForm({
      title: reminder.title,
      description: reminder.description || "",
      reminder_date: reminder.reminder_date.slice(0, 10),
      reminder_time: reminder.reminder_time || "",
    });
  };

  const handleDelete = async (id) => {
    await API.delete(`/reminders/${id}`);
    fetchReminders();
  };

  return (
    <div>
      <h1>Event Reminders</h1>
      <p className="sub-text">
        Add reminders for assignments, exams, events, and deadlines.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Reminder Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="reminder_date"
          min={today}
          value={form.reminder_date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="reminder_time"
          value={form.reminder_time}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">{editId ? "Update Reminder" : "Add Reminder"}</button>
      </form>

      <div className="cards-grid">
        {reminders.map((reminder) => (
          <div className="card" key={reminder.id}>
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
            <p>
              Date: {new Date(reminder.reminder_date).toLocaleDateString()}
            </p>
            <p>Time: {reminder.reminder_time || "Not set"}</p>

            <button className="small-btn" onClick={() => handleEdit(reminder)}>
              Edit
            </button>

            <button
              className="small-btn delete"
              onClick={() => handleDelete(reminder.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {reminders.length === 0 && <p>No reminders added.</p>}
    </div>
  );
}

export default Reminders;