const pool = require("../config/db");

const getAttendance = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM attendance WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

const addAttendance = async (req, res) => {
  try {
    const {
      subject_name,
      total_classes,
      attended_classes,
      required_percentage,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO attendance
      (user_id, subject_name, total_classes, attended_classes, required_percentage)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        req.user.id,
        subject_name,
        total_classes,
        attended_classes,
        required_percentage || 75,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Attendance add error:", error);
    res.status(500).json({ message: "Error adding attendance" });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const {
      subject_name,
      total_classes,
      attended_classes,
      required_percentage,
    } = req.body;

    const result = await pool.query(
      `UPDATE attendance
       SET subject_name = $1,
           total_classes = $2,
           attended_classes = $3,
           required_percentage = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        subject_name,
        total_classes,
        attended_classes,
        required_percentage || 75,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance" });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    await pool.query("DELETE FROM attendance WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Attendance deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting attendance" });
  }
};

module.exports = {
  getAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};