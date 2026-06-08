import { useEffect, useState } from "react";
import API from "../services/api";

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    holiday_date: "",
    description: "",
  });

  const fetchHolidays = async () => {
    try {
      const res = await API.get("/holidays");
      setHolidays(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addHoliday = async (e) => {
    e.preventDefault();

    try {
      await API.post("/holidays", form);

      setForm({
        title: "",
        holiday_date: "",
        description: "",
      });

      fetchHolidays();
    } catch (error) {
      setMessage(error.response?.data?.message || "Holiday save failed.");
    }
  };

  const deleteHoliday = async (id) => {
    await API.delete(`/holidays/${id}`);
    fetchHolidays();
  };

  return (
    <div>
      <h1>Holiday Calendar</h1>
      <p className="sub-text">
        Add college holidays and view upcoming holiday alerts.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={addHoliday}>
        <input
          type="text"
          name="title"
          placeholder="Holiday Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="holiday_date"
          value={form.holiday_date}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Add Holiday</button>
      </form>

      <div className="cards-grid">
        {holidays.map((holiday) => (
          <div className="card" key={holiday.id}>
            <h3>{holiday.title}</h3>
            <p>
              Date: {new Date(holiday.holiday_date).toLocaleDateString()}
            </p>
            <p>{holiday.description}</p>

            <button
              className="small-btn delete"
              onClick={() => deleteHoliday(holiday.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {holidays.length === 0 && <p>No holidays added.</p>}
    </div>
  );
}

export default Holidays;