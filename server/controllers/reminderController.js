const pool = require("../config/db");

const getReminders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM reminders WHERE user_id = $1 ORDER BY reminder_date ASC, reminder_time ASC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reminders" });
  }
};

const addReminder = async (req, res) => {
  try {
    const { title, description, reminder_date, reminder_time } = req.body;

    const result = await pool.query(
      `INSERT INTO reminders
      (user_id, title, description, reminder_date, reminder_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [req.user.id, title, description, reminder_date, reminder_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error adding reminder" });
  }
};

const updateReminder = async (req, res) => {
  try {
    const { title, description, reminder_date, reminder_time } = req.body;

    const result = await pool.query(
      `UPDATE reminders
       SET title = $1,
           description = $2,
           reminder_date = $3,
           reminder_time = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        title,
        description,
        reminder_date,
        reminder_time,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error updating reminder" });
  }
};

const deleteReminder = async (req, res) => {
  try {
    await pool.query("DELETE FROM reminders WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reminder" });
  }
};

module.exports = {
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
};
