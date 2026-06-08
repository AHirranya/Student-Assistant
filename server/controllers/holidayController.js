const pool = require("../config/db");

const getHolidays = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM holidays WHERE user_id = $1 ORDER BY holiday_date ASC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get holidays error:", error);
    res.status(500).json({ message: "Error fetching holidays" });
  }
};

const addHoliday = async (req, res) => {
  try {
    const { title, holiday_date, description } = req.body;

    if (!title || !holiday_date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const result = await pool.query(
      `INSERT INTO holidays
      (user_id, title, holiday_date, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [req.user.id, title, holiday_date, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add holiday error:", error);
    res.status(500).json({ message: "Error adding holiday" });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    await pool.query("DELETE FROM holidays WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Holiday deleted" });
  } catch (error) {
    console.error("Delete holiday error:", error);
    res.status(500).json({ message: "Error deleting holiday" });
  }
};

module.exports = {
  getHolidays,
  addHoliday,
  deleteHoliday,
};