const pool = require("../model/db");

// Get all founders
async function getFounders() {
  try {
    const [rows] = await pool.query(`SELECT * FROM founder ORDER BY created_at DESC`);
    return {
      success: true,
      message: "All founders retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching founder data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: [],
    };
  }
}

// Add a new founder
async function addFounder(full_name, avatar, email, role = "Founder", bio = null) {
  try {
    const [result] = await pool.query(
      `INSERT INTO founder (full_name, avatar, email, role, bio)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, avatar, email, role, bio]
    );

    return {
      success: true,
      message: "Founder added successfully",
      data: {
        id: result.insertId,
        full_name,
        avatar,
        email,
        role,
        bio,
      },
    };
  } catch (error) {
    console.error("Error inserting founder data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Update founder by ID
async function updateFounder(id, full_name, avatar, email, role, bio) {
  try {
    const [result] = await pool.query(
      `UPDATE founder 
       SET full_name = ?, avatar = ?, email = ?, role = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [full_name, avatar, email, role, bio, id]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Founder not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Founder updated successfully",
      data: { id, full_name, avatar, email, role, bio },
    };
  } catch (error) {
    console.error("Error updating founder data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Delete founder by ID
async function deleteFounder(id) {
  try {
    const [result] = await pool.query(`DELETE FROM founder WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "Founder not found",
      };
    }

    return {
      success: true,
      message: "Founder deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting founder data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

module.exports = { getFounders, addFounder, updateFounder, deleteFounder };
