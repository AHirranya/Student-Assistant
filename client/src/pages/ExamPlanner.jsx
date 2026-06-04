import { useEffect, useState } from "react";
import API from "../services/api";

function ExamPlanner() {
  const [exams, setExams] = useState([]);

  const [form, setForm] = useState({
    subject_name: "",
    exam_date: "",
    syllabus: "",
  });

  const fetchExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addExam = async (e) => {
    e.preventDefault();

    await API.post("/exams", form);

    setForm({
      subject_name: "",
      exam_date: "",
      syllabus: "",
    });

    fetchExams();
  };

  const deleteExam = async (id) => {
    await API.delete(`/exams/${id}`);
    fetchExams();
  };

  const daysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <h1>Exam Planner</h1>
      <p className="sub-text">Add exams and syllabus.</p>

      <form className="form-card" onSubmit={addExam}>
        <input
          name="subject_name"
          placeholder="Subject Name"
          value={form.subject_name}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="exam_date"
          value={form.exam_date}
          onChange={handleChange}
          required
        />

        <textarea
          name="syllabus"
          placeholder="Syllabus"
          value={form.syllabus}
          onChange={handleChange}
        />

        <button>Add Exam</button>
      </form>

      <div className="cards-grid">
        {exams.map((exam) => (
          <div className="card" key={exam.id}>
            <h3>{exam.subject_name}</h3>
            <p>{new Date(exam.exam_date).toLocaleDateString()}</p>
            <p>
              Days Left:{" "}
              {daysLeft(exam.exam_date) >= 0
                ? `${daysLeft(exam.exam_date)} days`
                : "Completed"}
            </p>
            <p>{exam.syllabus}</p>
            <button
              className="small-btn delete"
              onClick={() => deleteExam(exam.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExamPlanner;