const pool = require("../config/db");

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

const getCgpaSubjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cgpa WHERE user_id = $1 ORDER BY semester ASC, id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching CGPA data" });
  }
};

const addCgpaSubject = async (req, res) => {
  try {
    const { semester, subject_name, credits, grade } = req.body;

    if (!semester || !subject_name || !credits || !grade) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const grade_points = gradeMap[grade];

    if (grade_points === undefined) {
      return res.status(400).json({ message: "Invalid grade" });
    }

    const result = await pool.query(
      `INSERT INTO cgpa
      (user_id, semester, subject_name, credits, grade, grade_points)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [req.user.id, semester, subject_name, credits, grade, grade_points]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CGPA add error:", error);
    res.status(500).json({ message: "Error adding CGPA subject" });
  }
};

const deleteCgpaSubject = async (req, res) => {
  try {
    await pool.query("DELETE FROM cgpa WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "CGPA subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting CGPA subject" });
  }
};

module.exports = {
  getCgpaSubjects,
  addCgpaSubject,
  deleteCgpaSubject,
};