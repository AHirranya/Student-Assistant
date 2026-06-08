const pool = require("../config/db");

const getClassTopics = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM class_topics WHERE user_id = $1 ORDER BY class_date DESC, id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get class topics error:", error);
    res.status(500).json({ message: "Error fetching class topics" });
  }
};

const addClassTopic = async (req, res) => {
  try {
    const {
      subject_name,
      topic_title,
      topic_description,
      class_date,
      attended,
    } = req.body;

    if (!subject_name || !topic_title || !class_date) {
      return res.status(400).json({ message: "Subject, topic and date are required" });
    }

    const result = await pool.query(
      `INSERT INTO class_topics
      (user_id, subject_name, topic_title, topic_description, class_date, attended)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        req.user.id,
        subject_name,
        topic_title,
        topic_description,
        class_date,
        attended === false ? false : true,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add class topic error:", error);
    res.status(500).json({ message: "Error adding class topic" });
  }
};

const deleteClassTopic = async (req, res) => {
  try {
    await pool.query("DELETE FROM class_topics WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Class topic deleted" });
  } catch (error) {
    console.error("Delete class topic error:", error);
    res.status(500).json({ message: "Error deleting class topic" });
  }
};

module.exports = {
  getClassTopics,
  addClassTopic,
  deleteClassTopic,
};