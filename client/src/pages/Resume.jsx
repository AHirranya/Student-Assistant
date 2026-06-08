import { useEffect, useState } from "react";
import API from "../services/api";

function Resume() {
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState("");

  const backendBaseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

  const [form, setForm] = useState({
    resume_title: "",
    ats_score: "",
    suggestions: "",
    resume_pdf: null,
  });

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resumes");
      setResumes(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load resumes.");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e) => {
    setMessage("");

    if (e.target.type === "file") {
      setForm({ ...form, resume_pdf: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addResume = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("resume_title", form.resume_title);
      formData.append("ats_score", form.ats_score || 0);
      formData.append("suggestions", form.suggestions);

      if (form.resume_pdf) {
        formData.append("resume_pdf", form.resume_pdf);
      }

      await API.post("/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        resume_title: "",
        ats_score: "",
        suggestions: "",
        resume_pdf: null,
      });

      e.target.reset();
      fetchResumes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Resume upload failed.");
    }
  };

  const deleteResume = async (id) => {
    try {
      await API.delete(`/resumes/${id}`);
      fetchResumes();
    } catch (error) {
      setMessage(error.response?.data?.message || "Resume delete failed.");
    }
  };

  return (
    <div>
      <h1>Resume Section</h1>
      <p className="sub-text">
        Upload your resume PDF and track ATS score or improvement suggestions.
      </p>

      {message && <div className="error">{message}</div>}

      <form className="form-card" onSubmit={addResume}>
        <input
          type="text"
          name="resume_title"
          placeholder="Resume Title"
          value={form.resume_title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="ats_score"
          placeholder="ATS Score"
          value={form.ats_score}
          onChange={handleChange}
        />

        <input
          type="file"
          name="resume_pdf"
          accept="application/pdf"
          onChange={handleChange}
        />

        <textarea
          name="suggestions"
          placeholder="Suggestions / Improvements"
          value={form.suggestions}
          onChange={handleChange}
        />

        <button type="submit">Upload Resume</button>
      </form>

      <div className="cards-grid">
        {resumes.map((resume) => (
          <div className="card" key={resume.id}>
            <h3>{resume.resume_title}</h3>
            <p>
              <strong>ATS Score:</strong> {resume.ats_score}
            </p>
            <p>{resume.suggestions}</p>

            {resume.resume_file_url && (
              <a
                href={`${backendBaseUrl}${resume.resume_file_url}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume PDF
              </a>
            )}

            <br />
            <br />

            <button
              className="small-btn delete"
              onClick={() => deleteResume(resume.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {resumes.length === 0 && <p>No resumes uploaded.</p>}
    </div>
  );
}

export default Resume;