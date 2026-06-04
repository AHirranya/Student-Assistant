import { useEffect, useState } from "react";
import API from "../services/api";

function Reminders() {
  const [reminders, setReminders] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    reminder_date: "",
    reminder_time: "",
  });

  const fetchReminders = async () => {
    const res = await API.get("/reminders");
    setReminders(res.data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addReminder = async (e) => {
    e.preventDefault();

    await API.post("/reminders", form);

    setForm({
      title: "",
      description: "",
      reminder_date: "",
      reminder_time: "",
    });

    fetchReminders();
  };

  const deleteReminder = async (id) => {
    await API.delete(`/reminders/${id}`);
    fetchReminders();
  };

  return (
    <div>
      <h1>Event Reminders</h1>
      <p className="sub-text">Add assignments and event reminders.</p>

      <form className="form-card" onSubmit={addReminder}>
        <input
          name="title"
          placeholder="Reminder Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="reminder_date"
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

        <button>Add Reminder</button>
      </form>

      <div className="cards-grid">
        {reminders.map((reminder) => (
          <div className="card" key={reminder.id}>
            <h3>{reminder.title}</h3>
            <p>{reminder.description}</p>
            <p>{new Date(reminder.reminder_date).toLocaleDateString()}</p>
            <p>{reminder.reminder_time || "No time set"}</p>

            <button
              className="small-btn delete"
              onClick={() => deleteReminder(reminder.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reminders;