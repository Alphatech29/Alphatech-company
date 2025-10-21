const pool = require("../model/db");

// Add a new page
async function addPage(title, slug, description, content) {
  try {
    const [result] = await pool.query(
      `INSERT INTO pages (title, slug, description, content) VALUES (?, ?, ?, ?)`,
      [title, slug, description, content]
    );

    return {
      success: true,
      message: "Page added successfully",
      data: {
        id: result.insertId,
        title,
        slug,
        description,
        content,
      },
    };
  } catch (error) {
    console.error("Error inserting page data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Get all pages
async function getPages() {
  try {
    const [rows] = await pool.query(`SELECT * FROM pages ORDER BY created_at DESC`);
    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching pages:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Get a single page by ID
async function getPageById(id) {
  try {
    const [rows] = await pool.query(`SELECT * FROM pages WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return { success: false, message: "Page not found", data: null };
    }
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Error fetching page by ID:", error);
    return { success: false, message: "Internal Server Error", data: null };
  }
}

// Get a single page by slug
async function getPageBySlug(slug) {
  try {
    const [rows] = await pool.query(`SELECT * FROM pages WHERE slug = ?`, [slug]);
    if (rows.length === 0) {
      return { success: false, message: "Page not found", data: null };
    }
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return { success: false, message: "Internal Server Error", data: null };
  }
}

// Update a page by ID
async function updatePage(id, title, slug, description, content) {
  try {
    const [result] = await pool.query(
      `UPDATE pages SET title = ?, slug = ?, description = ?, content = ?, updated_at = NOW() WHERE id = ?`,
      [title, slug, description, content, id]
    );

    if (result.affectedRows === 0) {
      return { success: false, message: "Page not found" };
    }

    return {
      success: true,
      message: "Page updated successfully",
      data: { id, title, slug, description, content },
    };
  } catch (error) {
    console.error("Error updating page:", error);
    return { success: false, message: "Internal Server Error", data: null };
  }
}

// Delete a page by ID
async function deletePage(id) {
  try {
    const [result] = await pool.query(`DELETE FROM pages WHERE id = ?`, [id]);
    if (result.affectedRows === 0) {
      return { success: false, message: "Page not found" };
    }
    return { success: true, message: "Page deleted successfully" };
  } catch (error) {
    console.error("Error deleting page:", error);
    return { success: false, message: "Internal Server Error", data: null };
  }
}

module.exports = {
  addPage,
  getPages,
  getPageById,
  getPageBySlug,
  updatePage,
  deletePage,
};
