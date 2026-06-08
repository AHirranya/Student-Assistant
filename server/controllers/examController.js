const pool = require("../config/db");

const getExams = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM exams WHERE user_id = $1 ORDER BY exam_date ASC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get exams error:", error);
    res.status(500).json({ message: "Error fetching exams" });
  }
};

const addExam = async (req, res) => {
  try {
    const { subject_name, exam_date, exam_time, room_no, syllabus } = req.body;

    if (!subject_name || !exam_date) {
      return res.status(400).json({ message: "Subject and exam date are required" });
    }

    const today = new Date().toISOString().split("T")[0];

    if (exam_date < today) {
      return res.status(400).json({ message: "Exam date cannot be in the past" });
    }

    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO exams
      (user_id, subject_name, exam_date, exam_time, room_no, syllabus, pdf_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [req.user.id, subject_name, exam_date, exam_time || null, room_no, syllabus, pdfUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add exam error:", error);
    res.status(500).json({ message: "Error adding exam" });
  }
};

const updateExam = async (req, res) => {
  try {
    const { subject_name, exam_date, exam_time, room_no, syllabus } = req.body;

    const today = new Date().toISOString().split("T")[0];

    if (exam_date < today) {
      return res.status(400).json({ message: "Exam date cannot be in the past" });
    }

    const result = await pool.query(
      `UPDATE exams
       SET subject_name = $1,
           exam_date = $2,
           exam_time = $3,
           room_no = $4,
           syllabus = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        subject_name,
        exam_date,
        exam_time || null,
        room_no,
        syllabus,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update exam error:", error);
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
    console.error("Delete exam error:", error);
    res.status(500).json({ message: "Error deleting exam" });
  }
};

module.exports = {
  getExams,
  addExam,
  updateExam,
  deleteExam,
};