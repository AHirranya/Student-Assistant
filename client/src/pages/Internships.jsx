import { useEffect, useState } from "react";
import API from "../services/api";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    company_name: "",
    role_title: "",
    application_link: "",
    deadline: "",
    status: "Open",
    notes: "",
  });

  const fetchInternships = async () => {
    try {
      const res = await API.get("/internships");
      setInternships(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleChange = (e) => {
    setMessage("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addInternship = async (e) => {
    e.preventDefault();

    try {
      await API.post("/internships", form);

      setForm({
        company_name: "",
        role_title: "",
        application_link: "",
        deadline: "",
        status: "Open",
        notes: "",
      });

      fetchInternships();
    } catch (error) {
      setMessage(error.response?.data?.message || "Internship save failed.");
    }
  };

  const deleteInternship = async (id) => {
    await API.delete(`/internships/${id}`);
    fetchInternships();
  };

  return (
    <div>
      <h1>Internship Updates</h1>
      <p className="sub-text">
        Track internship opportunities, application links, and deadlines.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={addInternship}>
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="role_title"
          placeholder="Role Title"
          value={form.role_title}
          onChange={handleChange}
          required
        />

        <input
          type="url"
          name="application_link"
          placeholder="Application Link"
          value={form.application_link}
          onChange={handleChange}
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Open">Open</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Closed">Closed</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />

        <button type="submit">Add Internship</button>
      </form>

      <div className="cards-grid">
        {internships.map((internship) => (
          <div className="card" key={internship.id}>
            <h3>{internship.company_name}</h3>
            <p>
              <strong>Role:</strong> {internship.role_title}
            </p>
            <p>
              <strong>Status:</strong> {internship.status}
            </p>
            <p>
              <strong>Deadline:</strong>{" "}
              {internship.deadline
                ? new Date(internship.deadline).toLocaleDateString()
                : "Not set"}
            </p>
            <p>{internship.notes}</p>

            {internship.application_link && (
              <a href={internship.application_link} target="_blank">
                Apply / Open Link
              </a>
            )}

            <br />
            <br />

            <button
              className="small-btn delete"
              onClick={() => deleteInternship(internship.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {internships.length === 0 && <p>No internship updates added.</p>}
    </div>
  );
}

export default Internships;