const asyncHandler = require("../../middleWare/asyncHandler");
const { insertBlog, getBlogs, deleteBlogById, updateBlogById} = require("../../utilities/blog");

// Controller to create a new blog
const createBlog = asyncHandler(async (req, res) => {

  try {
    let blogData;

    try {
      blogData = req.body.blog ? JSON.parse(req.body.blog) : req.body;
    } catch (err) {
      console.error("Invalid JSON format in blog field:", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in blog field.",
        error: err.message,
      });
    }

    // Handle cover image upload
    blogData.cover_image =
      req.files && req.files.length > 0
        ? `/uploads/${req.files[0].filename}`
        : null;

    // Validate required fields
    const { title, slug, content, author, category, cover_image } = blogData;
    if (!title || !slug || !content || !author || !category) {
      console.warn("Missing required fields:", {
        title,
        slug,
        content,
        author,
        category,
      });
      return res.status(400).json({
        success: false,
        message: "Title, Slug, Content, Author, and Category are required.",
      });
    }

    // Insert blog into database
    const result = await insertBlog(title, slug, content, author, category, cover_image);

    // Respond based on the result
    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message || "Blog created successfully.",
        insertId: result.insertId,
        data: { id: result.insertId, ...blogData },
      });
    } else {
      console.error("Failed to insert blog:", result.message);
      return res.status(500).json({
        success: false,
        message: result.message || "Failed to insert blog.",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("Exception in createBlog controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
});

// Controller to fetch all blogs
const getBlogController = asyncHandler(async (req, res) => {

  try {
    const result = await getBlogs();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message || "Blogs retrieved successfully.",
        data: result.data || [],
      });
    } else {
      console.error("Failed to retrieve blogs:", result.message);
      return res.status(500).json({
        success: false,
        message: result.message || "Failed to fetch blogs.",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Exception in getBlogController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
});


const deleteBlogController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    console.warn(`[WARN] Invalid or missing blog ID: ${id}`);
    return res.status(400).json({
      success: false,
      message: "Invalid or missing blog ID.",
      data: null,
    });
  }

  try {
    const result = await deleteBlogById(id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { id: Number(id) || id },
      });
    } else {
      console.warn(`[WARN] Blog with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: result.message,
        data: null,
      });
    }
  } catch (error) {
    console.error(`[ERROR] Exception in deleteBlogController:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog due to server error.",
      data: null,
      error: error.message || String(error),
    });
  }
});


// Controller to update a blog by ID
const updateBlogController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    console.warn(`[WARN] Invalid or missing blog ID: ${id}`);
    return res.status(400).json({
      success: false,
      message: "Invalid or missing blog ID.",
      data: null,
    });
  }

  let blogData;
  try {
    blogData = req.body.blog ? JSON.parse(req.body.blog) : req.body;
  } catch (err) {
    console.error("Invalid JSON format in blog field:", err.message);
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format in blog field.",
      error: err.message,
    });
  }

  // Handle cover image upload if any
  if (req.files && req.files.length > 0) {
    blogData.cover_image = `/uploads/${req.files[0].filename}`;
  }

  const { title, slug, content, author, category, cover_image } = blogData;

  // Optional: Validate required fields if you want to enforce all fields
  if (!title || !slug || !content || !author || !category) {
    console.warn("Missing required fields for update:", {
      title,
      slug,
      content,
      author,
      category,
    });
    return res.status(400).json({
      success: false,
      message: "Title, Slug, Content, Author, and Category are required for update.",
    });
  }

  try {
    const result = await updateBlogById(
      id,
      title,
      slug,
      content,
      author,
      category,
      cover_image
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message || "Blog updated successfully.",
        updatedId: result.updatedId,
        data: { id: Number(id) || id, ...blogData },
      });
    } else {
      console.warn(`[WARN] Failed to update blog with ID ${id}: ${result.message}`);
      return res.status(404).json({
        success: false,
        message: result.message || "Blog not found.",
      });
    }
  } catch (error) {
    console.error(`[ERROR] Exception in updateBlogController:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog due to server error.",
      error: error.message || String(error),
    });
  }
});

module.exports = {
  createBlog,
  getBlogController,
  deleteBlogController,
  updateBlogController,
};
