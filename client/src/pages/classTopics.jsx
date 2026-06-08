import { useEffect, useState } from "react";
import API from "../services/api";

function ClassTopics() {
  const today = new Date().toISOString().split("T")[0];

  const [topics, setTopics] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    subject_name: "",
    topic_title: "",
    topic_description: "",
    class_date: today,
    attended: true,
  });

  const fetchTopics = async () => {
    try {
      const res = await API.get("/class-topics");
      setTopics(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load topics.");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    setMessage("");

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addTopic = async (e) => {
    e.preventDefault();

    try {
      await API.post("/class-topics", form);

      setForm({
        subject_name: "",
        topic_title: "",
        topic_description: "",
        class_date: today,
        attended: true,
      });

      fetchTopics();
    } catch (error) {
      setMessage(error.response?.data?.message || "Class topic save failed.");
    }
  };

  const deleteTopic = async (id) => {
    try {
      await API.delete(`/class-topics/${id}`);
      fetchTopics();
    } catch (error) {
      setMessage(error.response?.data?.message || "Class topic delete failed.");
    }
  };

  return (
    <div>
      <h1>Today’s Class Topics</h1>
      <p className="sub-text">
        Record what topics were completed in today’s class.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={addTopic}>
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
          name="topic_title"
          placeholder="Topic Title"
          value={form.topic_title}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="class_date"
          value={form.class_date}
          onChange={handleChange}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="attended"
            checked={form.attended}
            onChange={handleChange}
          />
          Attended this class
        </label>

        <textarea
          name="topic_description"
          placeholder="Topic Description"
          value={form.topic_description}
          onChange={handleChange}
        />

        <button type="submit">Add Class Topic</button>
      </form>

      <div className="cards-grid">
        {topics.map((topic) => (
          <div className="card" key={topic.id}>
            <h3>{topic.topic_title}</h3>
            <p>
              <strong>Subject:</strong> {topic.subject_name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(topic.class_date).toLocaleDateString()}
            </p>
            <p>{topic.topic_description}</p>

            <span className={topic.attended ? "badge safe" : "badge danger"}>
              {topic.attended ? "Attended" : "Not Attended"}
            </span>

            <br />
            <br />

            <button
              className="small-btn delete"
              onClick={() => deleteTopic(topic.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {topics.length === 0 && <p>No class topics added.</p>}
    </div>
  );
}

export default ClassTopics;