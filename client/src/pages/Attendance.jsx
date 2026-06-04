import { useEffect, useState } from "react";
import API from "../services/api";

function Attendance() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    subject_name: "",
    total_classes: "",
    attended_classes: "",
    required_percentage: 75,
  });

  const [editId, setEditId] = useState(null);

  const fetchAttendance = async () => {
    const res = await API.get("/attendance");
    setRecords(res.data);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const percentage = (item) => {
    if (Number(item.total_classes) <= 0) return "0.00";

    return (
      (Number(item.attended_classes) / Number(item.total_classes)) *
      100
    ).toFixed(2);
  };

  const canBunk = (item) => {
    let total = Number(item.total_classes);
    let attended = Number(item.attended_classes);
    let required = Number(item.required_percentage);
    let bunk = 0;

    while ((attended / (total + bunk + 1)) * 100 >= required && bunk < 500) {
      bunk++;
    }

    return bunk;
  };

  const needToAttend = (item) => {
    let total = Number(item.total_classes);
    let attended = Number(item.attended_classes);
    let required = Number(item.required_percentage);
    let need = 0;

    while (
      ((attended + need) / (total + need)) * 100 < required &&
      need < 500
    ) {
      need++;
    }

    return need;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await API.put(`/attendance/${editId}`, form);
      setEditId(null);
    } else {
      await API.post("/attendance", form);
    }

    setForm({
      subject_name: "",
      total_classes: "",
      attended_classes: "",
      required_percentage: 75,
    });

    fetchAttendance();
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      subject_name: item.subject_name,
      total_classes: item.total_classes,
      attended_classes: item.attended_classes,
      required_percentage: item.required_percentage,
    });
  };

  const handleDelete = async (id) => {
    await API.delete(`/attendance/${id}`);
    fetchAttendance();
  };

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <p className="sub-text">Track subject attendance and bunk status.</p>

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
          type="number"
          name="total_classes"
          placeholder="Total Classes"
          value={form.total_classes}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="attended_classes"
          placeholder="Attended Classes"
          value={form.attended_classes}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="required_percentage"
          placeholder="Required Percentage"
          value={form.required_percentage}
          onChange={handleChange}
          required
        />

        <button type="submit">{editId ? "Update" : "Add Subject"}</button>
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Total</th>
              <th>Attended</th>
              <th>%</th>
              <th>Status</th>
              <th>Can Bunk</th>
              <th>Need Attend</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.map((item) => {
              const percent = Number(percentage(item));
              const safe = percent >= Number(item.required_percentage);

              return (
                <tr key={item.id}>
                  <td>{item.subject_name}</td>
                  <td>{item.total_classes}</td>
                  <td>{item.attended_classes}</td>
                  <td>{percent.toFixed(2)}%</td>
                  <td>
                    <span className={safe ? "badge safe" : "badge danger"}>
                      {safe ? "Safe" : "Warning"}
                    </span>
                  </td>
                  <td>{safe ? `${canBunk(item)} classes` : "No bunk"}</td>
                  <td>{safe ? "0" : `${needToAttend(item)} classes`}</td>
                  <td>
                    <button
                      className="small-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="small-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {records.length === 0 && <p>No attendance records added.</p>}
      </div>
    </div>
  );
}

export default Attendance;