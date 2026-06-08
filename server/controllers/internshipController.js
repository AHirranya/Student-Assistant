const pool = require("../config/db");

const getInternships = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM internships WHERE user_id = $1 ORDER BY deadline ASC, id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Get internships error:", error);
    res.status(500).json({ message: "Error fetching internships" });
  }
};

const addInternship = async (req, res) => {
  try {
    const {
      company_name,
      role_title,
      application_link,
      deadline,
      status,
      notes,
    } = req.body;

    if (!company_name || !role_title) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const result = await pool.query(
      `INSERT INTO internships
      (user_id, company_name, role_title, application_link, deadline, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        req.user.id,
        company_name,
        role_title,
        application_link,
        deadline || null,
        status || "Open",
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Add internship error:", error);
    res.status(500).json({ message: "Error adding internship" });
  }
};

const updateInternship = async (req, res) => {
  try {
    const {
      company_name,
      role_title,
      application_link,
      deadline,
      status,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE internships
       SET company_name = $1,
           role_title = $2,
           application_link = $3,
           deadline = $4,
           status = $5,
           notes = $6
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        company_name,
        role_title,
        application_link,
        deadline || null,
        status,
        notes,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update internship error:", error);
    res.status(500).json({ message: "Error updating internship" });
  }
};

const deleteInternship = async (req, res) => {
  try {
    await pool.query("DELETE FROM internships WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id,
    ]);

    res.json({ message: "Internship deleted" });
  } catch (error) {
    console.error("Delete internship error:", error);
    res.status(500).json({ message: "Error deleting internship" });
  }
};

module.exports = {
  getInternships,
  addInternship,
  updateInternship,
  deleteInternship,
};