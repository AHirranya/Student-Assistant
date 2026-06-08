const pool = require("../config/db");

const getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
};

const addNote = async (req, res) => {
  try {
    const { subject_name, topic_name, note_content, completed } = req.body;

    if (!subject_name || !topic_name) {
      return res.status(400).json({ message: "Subject and topic are required" });
    }

    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO notes
      (user_id, subject_name, topic_name, note_content, completed, pdf_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        req.user.id,
        subject_name,
        topic_name,
        note_content,
        completed === true || completed === "true",
        pdfUrl,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ message: "Error adding note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { subject_name, topic_name, note_content, completed } = req.body;

    const result = await pool.query(
      `UPDATE notes
       SET subject_name = $1,
           topic_name = $2,
           note_content = $3,
           completed = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        subject_name,
        topic_name,
        note_content,
        completed,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Error updating note" });
  }
};

const deleteNote = async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
};

module.exports = {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
};