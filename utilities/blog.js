const pool = require("../model/db");

// Insert a new blog
const insertBlog = async (title, slug, content, author, category, cover_image) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO blogs (title, slug, content, author, category, cover_image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, content, author, category, cover_image]
    );

    console.log("Blog inserted successfully with ID:", result.insertId);

    return {
      success: true,
      message: "Blog inserted successfully",
      insertId: result.insertId,
    };
  } catch (error) {
    console.error("Error inserting blog:", error);

    return {
      success: false,
      message: "Failed to insert blog",
      error: error.message || error,
    };
  }
};

// Fetch all blogs
const getBlogs = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs");

    return {
      success: true,
      message: "Blogs retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return {
      success: false,
      message: "Failed to fetch blogs",
      error: error.message || error,
    };
  }
};

// Delete blog by ID
const deleteBlogById = async (id) => {
  try {
    const [result] = await pool.query("DELETE FROM blogs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: `No blog found with ID: ${id}`,
      };
    }

    return {
      success: true,
      message: `Blog with ID ${id} deleted successfully`,
    };
  } catch (error) {
    console.error("Error deleting blog:", error);

    return {
      success: false,
      message: "Failed to delete blog",
      error: error.message || error,
    };
  }
};


// Update a blog by ID
const updateBlogById = async (id, title, slug, content, author, category, cover_image) => {
  try {
    const [result] = await pool.query(
      `UPDATE blogs 
       SET title = ?, slug = ?, content = ?, author = ?, category = ?, cover_image = ?
       WHERE id = ?`,
      [title, slug, content, author, category, cover_image, id]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "No blog found with the given ID",
      };
    }

    console.log("Blog updated successfully with ID:", id);

    return {
      success: true,
      message: "Blog updated successfully",
        updatedId: id,
    };
  } catch (error) {
    console.error("Error updating blog:", error);

    return {
      success: false,
      message: "Failed to update blog",
      error: error.message || error,
    };
  }
};

module.exports = { insertBlog, getBlogs, deleteBlogById, updateBlogById};
