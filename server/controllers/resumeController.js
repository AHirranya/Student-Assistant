const pool = require("../config/db");

const getResumes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM resumes WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get resumes error:", error);
    res.status(500).json({ message: "Error fetching resumes" });
  }
};

const addResume = async (req, res) => {
  try {
    const { resume_title, ats_score, suggestions } = req.body;

    if (!resume_title) {
      return res.status(400).json({ message: "Resume title is required" });
    }

    const resumeFileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO resumes
      (user_id, resume_title, resume_file_url, ats_score, suggestions)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        req.user.id,
        resume_title,
        resumeFileUrl,
        ats_score || 0,
        suggestions || "Upload resume and review manually.",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add resume error:", error);
    res.status(500).json({ message: "Error adding resume" });
  }
};

const deleteResume = async (req, res) => {
  try {
    await pool.query("DELETE FROM resumes WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Resume deleted" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Error deleting resume" });
  }
};

module.exports = {
  getResumes,
  addResume,
  deleteResume,
};