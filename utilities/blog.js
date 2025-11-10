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

// Insert a new comment for a blog
const insertBlogComment = async (blog_id, commenter_name = "Anonymous", comment_text) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO blog_comments (blog_id, commenter_name, comment_text)
       VALUES (?, ?, ?)`,
      [blog_id, commenter_name, comment_text]
    );

    console.log("Comment added successfully with ID:", result.insertId);

    return {
      success: true,
      message: "Comment added successfully",
      insertId: result.insertId,
    };
  } catch (error) {
    console.error("Error inserting comment:", error);

    return {
      success: false,
      message: "Failed to add comment",
      error: error.message || error,
    };
  }
};

const getCommentsByBlogId = async (blog_id) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM blog_comments WHERE blog_id = ? ORDER BY created_at DESC`,
      [blog_id]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: `No comments found for blog ID: ${blog_id}`,
        data: [],
      };
    }

    console.log(`Comments fetched successfully for blog ID: ${blog_id}`);

    return {
      success: true,
      message: "Comments retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);

    return {
      success: false,
      message: "Failed to fetch comments",
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

// Get a blog by slug
const getBlogBySlug = async (slug) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM blogs WHERE slug = ? LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "No blog found with the given slug",
      };
    }

    console.log("Blog fetched successfully:", slug);

    return {
      success: true,
      blog: rows[0],
    };
  } catch (error) {
    console.error("Error fetching blog:", error);

    return {
      success: false,
      message: "Failed to fetch blog",
      error: error.message || error,
    };
  }
};

// Increment blog views by ID
const incrementBlogViewsById = async (id) => {
  try {
    const [result] = await pool.query(
      `UPDATE blogs
       SET views = views + 1
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "No blog found with the given ID",
      };
    }

    console.log(`Views incremented for blog ID: ${id}`);

    return {
      success: true,
      message: "Blog views incremented successfully",
      updatedId: id,
    };
  } catch (error) {
    console.error("Error incrementing blog views:", error);

    return {
      success: false,
      message: "Failed to increment blog views",
      error: error.message || error,
    };
  }
};


module.exports = {
  insertBlog,
  getBlogs,
  deleteBlogById,
  updateBlogById,
  getBlogBySlug,
  insertBlogComment,
  getCommentsByBlogId,
  incrementBlogViewsById,
};
