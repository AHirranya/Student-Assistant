import { useEffect, useState } from "react";
import API from "../services/api";

function ExamPlanner() {
  const [exams, setExams] = useState([]);
  const [message, setMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const backendBaseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  const [form, setForm] = useState({
    subject_name: "",
    exam_date: "",
    exam_time: "",
    room_no: "",
    syllabus: "",
    exam_pdf: null,
  });

  const fetchExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const daysLeft = (date) => {
    const examDate = new Date(date);
    const now = new Date();
    const diff = examDate - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e) => {
    setMessage("");

    if (e.target.type === "file") {
      setForm({
        ...form,
        exam_pdf: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.exam_date < today) {
      setMessage("Exam date cannot be in the past.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("subject_name", form.subject_name);
      formData.append("exam_date", form.exam_date);
      formData.append("exam_time", form.exam_time);
      formData.append("room_no", form.room_no);
      formData.append("syllabus", form.syllabus);

      if (form.exam_pdf) {
        formData.append("exam_pdf", form.exam_pdf);
      }

      await API.post("/exams", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        subject_name: "",
        exam_date: "",
        exam_time: "",
        room_no: "",
        syllabus: "",
        exam_pdf: null,
      });

      e.target.reset();
      fetchExams();
    } catch (error) {
      setMessage(error.response?.data?.message || "Exam save failed.");
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/exams/${id}`);
    fetchExams();
  };

  return (
    <div>
      <h1>Exam Planner</h1>
      <p className="sub-text">
        Add exam timetable, room details, syllabus, and PDF.
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
          type="date"
          name="exam_date"
          min={today}
          value={form.exam_date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="exam_time"
          value={form.exam_time}
          onChange={handleChange}
        />

        <input
          type="text"
          name="room_no"
          placeholder="Room Number"
          value={form.room_no}
          onChange={handleChange}
        />

        <input
          type="file"
          name="exam_pdf"
          accept="application/pdf"
          onChange={handleChange}
        />

        <textarea
          name="syllabus"
          placeholder="Syllabus / Important Topics"
          value={form.syllabus}
          onChange={handleChange}
        />

        <button type="submit">Add Exam</button>
      </form>

      <div className="cards-grid">
        {exams.map((exam) => (
          <div className="card" key={exam.id}>
            <h3>{exam.subject_name}</h3>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(exam.exam_date).toLocaleDateString()}
            </p>

            <p>
              <strong>Time:</strong> {exam.exam_time || "Not set"}
            </p>

            <p>
              <strong>Room:</strong> {exam.room_no || "Not set"}
            </p>

            <p>
              <strong>Days Left:</strong>{" "}
              {daysLeft(exam.exam_date) >= 0
                ? `${daysLeft(exam.exam_date)} days`
                : "Completed"}
            </p>

            <p>{exam.syllabus}</p>

            {exam.pdf_url && (
              <a href={`${backendBaseUrl}${exam.pdf_url}`} target="_blank">
                View Exam PDF
              </a>
            )}

            <br />
            <br />

            <button
              className="small-btn delete"
              onClick={() => handleDelete(exam.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {exams.length === 0 && <p>No exams added.</p>}
    </div>
  );
}

export default ExamPlanner;