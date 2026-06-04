import { useEffect, useState } from "react";
import API from "../services/api";

const gradeMap = {
  O: 10,
  "A+": 9,
  A: 8,
  "B+": 7,
  B: 6,
  C: 5,
  D: 4,
  E: 3,
  F: 0,
};

const gradeOptions = [
  { grade: "O", point: 10, label: "O - Outstanding" },
  { grade: "A+", point: 9, label: "A+ - Excellent" },
  { grade: "A", point: 8, label: "A - Very Good" },
  { grade: "B+", point: 7, label: "B+ - Good" },
  { grade: "B", point: 6, label: "B - Above Average" },
  { grade: "C", point: 5, label: "C - Average" },
  { grade: "D", point: 4, label: "D - Pass" },
  { grade: "E", point: 3, label: "E - Poor" },
  { grade: "F", point: 0, label: "F - Fail" },
];

function CGPA() {
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    semester: "",
    subject_name: "",
    credits: "",
    grade: "",
  });

  const [nextForm, setNextForm] = useState({
    subject_name: "",
    credits: "",
    grade: "",
  });

  const [nextSubjects, setNextSubjects] = useState([]);

  const fetchSubjects = async () => {
    const res = await API.get("/cgpa");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const currentCredits = subjects.reduce(
    (sum, item) => sum + Number(item.credits || 0),
    0
  );

  const currentPoints = subjects.reduce(
    (sum, item) =>
      sum + Number(item.credits || 0) * Number(item.grade_points || 0),
    0
  );

  const currentCGPA =
    currentCredits > 0 ? currentPoints / currentCredits : 0;

  const nextCredits = nextSubjects.reduce(
    (sum, item) => sum + Number(item.credits || 0),
    0
  );

  const nextPoints = nextSubjects.reduce(
    (sum, item) =>
      sum + Number(item.credits || 0) * Number(gradeMap[item.grade] || 0),
    0
  );

  const nextSGPA = nextCredits > 0 ? nextPoints / nextCredits : 0;

  const predictedCGPA =
    currentCredits + nextCredits > 0
      ? (currentPoints + nextPoints) / (currentCredits + nextCredits)
      : 0;

  const requiredSGPA =
    nextCredits > 0
      ? (currentCGPA * (currentCredits + nextCredits) - currentPoints) /
        nextCredits
      : 0;

  const minimumGradeNeeded = () => {
    if (nextCredits === 0) return "Add next semester subjects first";

    if (requiredSGPA > 10) return "Not possible even with O grade";

    const grades = [
      { grade: "F", point: 0 },
      { grade: "E", point: 3 },
      { grade: "D", point: 4 },
      { grade: "C", point: 5 },
      { grade: "B", point: 6 },
      { grade: "B+", point: 7 },
      { grade: "A", point: 8 },
      { grade: "A+", point: 9 },
      { grade: "O", point: 10 },
    ];

    const needed = grades.find((item) => item.point >= requiredSGPA);

    return needed ? `${needed.grade} or above average` : "Not possible";
  };

  const predictionMessage = () => {
    if (nextCredits === 0) {
      return "Add next semester subjects to predict CGPA.";
    }

    if (predictedCGPA >= currentCGPA) {
      return "Your CGPA will not decrease with these grades.";
    }

    return `Your CGPA may decrease by ${(currentCGPA - predictedCGPA).toFixed(
      2
    )}. Improve your expected grades.`;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextChange = (e) => {
    setNextForm({
      ...nextForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/cgpa", form);

    setForm({
      semester: "",
      subject_name: "",
      credits: "",
      grade: "",
    });

    fetchSubjects();
  };

  const handleDelete = async (id) => {
    await API.delete(`/cgpa/${id}`);
    fetchSubjects();
  };

  const addNextSubject = (e) => {
    e.preventDefault();

    setNextSubjects([...nextSubjects, nextForm]);

    setNextForm({
      subject_name: "",
      credits: "",
      grade: "",
    });
  };

  const removeNextSubject = (index) => {
    setNextSubjects(nextSubjects.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>CGPA Predictor</h1>
      <p className="sub-text">
        Select grades and predict next semester CGPA.
      </p>

      <div className="cgpa-summary">
        <div className="result-box">
          Current CGPA: <strong>{currentCGPA.toFixed(2)}</strong>
        </div>

        <div className="result-box">
          Current Credits: <strong>{currentCredits}</strong>
        </div>

        <div className="result-box">
          Next SGPA: <strong>{nextSGPA.toFixed(2)}</strong>
        </div>

        <div className="result-box">
          Predicted CGPA: <strong>{predictedCGPA.toFixed(2)}</strong>
        </div>
      </div>

      <div className="prediction-box">
        <h2>Next Semester Protection</h2>

        <p>
          Required SGPA to prevent CGPA decrease:{" "}
          <strong>{nextCredits === 0 ? "Add subjects" : requiredSGPA.toFixed(2)}</strong>
        </p>

        <p>
          Minimum average grade needed:{" "}
          <strong>{minimumGradeNeeded()}</strong>
        </p>

        <p
          className={
            predictedCGPA >= currentCGPA
              ? "prediction-safe"
              : "prediction-danger"
          }
        >
          {predictionMessage()}
        </p>
      </div>

      <h2 className="section-title">Add Current / Previous Semester Subject</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <input
          type="number"
          name="semester"
          placeholder="Semester"
          value={form.semester}
          onChange={handleChange}
          required
        />

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
          name="credits"
          placeholder="Credits"
          value={form.credits}
          onChange={handleChange}
          required
        />

        <select name="grade" value={form.grade} onChange={handleChange} required>
          <option value="">Select Grade</option>
          {gradeOptions.map((item) => (
            <option key={item.grade} value={item.grade}>
              {item.label} - {item.point}
            </option>
          ))}
        </select>

        <button type="submit">Add Subject</button>
      </form>

      <div className="table-card">
        <h2>Saved Subjects</h2>

        <table>
          <thead>
            <tr>
              <th>Semester</th>
              <th>Subject</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Grade Points</th>
              <th>Credit Points</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((item) => (
              <tr key={item.id}>
                <td>{item.semester}</td>
                <td>{item.subject_name}</td>
                <td>{item.credits}</td>
                <td>
                  <span className="grade-badge">{item.grade || "-"}</span>
                </td>
                <td>{item.grade_points}</td>
                <td>
                  {Number(item.credits) * Number(item.grade_points)}
                </td>
                <td>
                  <button
                    className="small-btn delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subjects.length === 0 && <p>No saved subjects added.</p>}
      </div>

      <h2 className="section-title">Next Semester What-If Prediction</h2>

      <form className="form-card" onSubmit={addNextSubject}>
        <input
          type="text"
          name="subject_name"
          placeholder="Next Semester Subject"
          value={nextForm.subject_name}
          onChange={handleNextChange}
          required
        />

        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={nextForm.credits}
          onChange={handleNextChange}
          required
        />

        <select
          name="grade"
          value={nextForm.grade}
          onChange={handleNextChange}
          required
        >
          <option value="">Expected Grade</option>
          {gradeOptions.map((item) => (
            <option key={item.grade} value={item.grade}>
              {item.label} - {item.point}
            </option>
          ))}
        </select>

        <button type="submit">Add Prediction Subject</button>
      </form>

      <div className="table-card">
        <h2>Next Semester Prediction Subjects</h2>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Credits</th>
              <th>Expected Grade</th>
              <th>Grade Point</th>
              <th>Credit Points</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {nextSubjects.map((item, index) => (
              <tr key={index}>
                <td>{item.subject_name}</td>
                <td>{item.credits}</td>
                <td>
                  <span className="grade-badge">{item.grade}</span>
                </td>
                <td>{gradeMap[item.grade]}</td>
                <td>{Number(item.credits) * Number(gradeMap[item.grade])}</td>
                <td>
                  <button
                    className="small-btn delete"
                    onClick={() => removeNextSubject(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {nextSubjects.length === 0 && (
          <p>No next semester prediction subjects added.</p>
        )}
      </div>
    </div>
  );
}

export default CGPA;