const pool = require("../config/db");

const getExams = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM exams WHERE user_id = $1 ORDER BY exam_date ASC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching exams" });
  }
};

const addExam = async (req, res) => {
  try {
    const { subject_name, exam_date, syllabus } = req.body;

    const result = await pool.query(
      `INSERT INTO exams
      (user_id, subject_name, exam_date, syllabus)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [req.user.id, subject_name, exam_date, syllabus]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding exam" });
  }
};

const updateExam = async (req, res) => {
  try {
    const { subject_name, exam_date, syllabus } = req.body;

    const result = await pool.query(
      `UPDATE exams
       SET subject_name = $1,
           exam_date = $2,
           syllabus = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [subject_name, exam_date, syllabus, req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating exam" });
  }
};

const deleteExam = async (req, res) => {
  try {
    await pool.query("DELETE FROM exams WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Exam deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting exam" });
  }
};

module.exports = {
  getExams,
  addExam,
  updateExam,
  deleteExam,
};