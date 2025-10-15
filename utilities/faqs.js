const pool = require("../model/db");

// Get all FAQs
async function getFaqs() {
  try {
    const [rows] = await pool.query(`SELECT * FROM faqs ORDER BY created_at DESC`);
    return {
      success: true,
      message: "All FAQs retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching FAQs data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: [],
    };
  }
}

// Add a new FAQ
async function addFaq(question, answer) {
  try {
    const [result] = await pool.query(
      `INSERT INTO faqs (question, answer) VALUES (?, ?)`,
      [question, answer]
    );

    return {
      success: true,
      message: "FAQ added successfully",
      data: {
        id: result.insertId,
        question,
        answer,
      },
    };
  } catch (error) {
    console.error("Error inserting FAQ data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Update FAQ by ID
async function updateFaq(id, question, answer) {
  try {
    const [result] = await pool.query(
      `UPDATE faqs SET question = ?, answer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [question, answer, id]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "FAQ not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "FAQ updated successfully",
      data: {
        id,
        question,
        answer,
      },
    };
  } catch (error) {
    console.error("Error updating FAQ data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Delete FAQ by ID
async function deleteFaq(id) {
  try {
    const [result] = await pool.query(`DELETE FROM faqs WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "FAQ not found",
      };
    }

    return {
      success: true,
      message: "FAQ deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting FAQ data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

module.exports = { getFaqs, addFaq, updateFaq, deleteFaq };
