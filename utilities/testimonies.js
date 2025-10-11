const pool = require("../model/db");

async function insertTestimony(testimony) {
  const { name, position, message, rating } = testimony;

  try {
    const [result] = await pool.query(
      `INSERT INTO testimonies
      (name, position, message, rating)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        position || null,
        message,
        rating || null
      ]
    );

    return {
      success: true,
      message: "Testimony record inserted successfully",
      insertId: result.insertId,
    };
  } catch (error) {
    console.error("Error inserting testimony data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

async function getTestimonies() {
  try {
    const [rows] = await pool.query(`SELECT * FROM testimonies ORDER BY created_at DESC`);

    return {
      success: true,
      message: "All testimonies retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching testimonies data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: [],
    };
  }
}

async function deleteTestimonyById(id) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return {
        success: false,
        message: `Invalid ID format: ${id}`,
      };
    }

    const [result] = await pool.query(
      `DELETE FROM testimonies WHERE id = ?`,
      [numericId]
    );


    if (result.affectedRows === 0) {
      return {
        success: false,
        message: `No testimony found with ID: ${numericId}`,
      };
    }

    return {
      success: true,
      message: `Testimony with ID ${numericId} deleted successfully.`,
    };
  } catch (error) {
    console.error("Error deleting testimony data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}




module.exports = {insertTestimony, getTestimonies, deleteTestimonyById};