import axios from "axios";

export const createBlog = async (blogData, coverImageFile) => {
  try {
    const formData = new FormData();

    formData.append("blog", JSON.stringify(blogData));

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    }

    const response = await axios.post("/api/createBlog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Blog created successfully!",
      insertId: payload?.insertId || null,
      data: payload?.data || {},
    };
  } catch (error) {
    console.error(
      "Creating blog failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while creating the blog.",
      error: error.response?.data || error.message,
    };
  }
};


export const getBlogs = async () => {
  try {
    // Send GET request to backend
    const response = await axios.get("/api/getBlog", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = response.data;

    const blogs = Array.isArray(payload?.data) ? payload.data : [];

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Blogs retrieved successfully!",
      data: blogs,
    };
  } catch (error) {
    console.error("Fetching blogs failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching blogs.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};



export const deleteBlog = async (id) => {
  // Validate ID
  if (!id || (typeof id !== "string" && typeof id !== "number")) {
    return {
      success: false,
      message: "Invalid or missing blog ID.",
      data: null,
    };
  }

  try {
    // Send DELETE request to backend
    const response = await axios.delete(`/api/deleteBlog/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || `Blog with ID ${id} deleted successfully.`,
      data: payload?.data ?? { id },
    };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    console.error("Deleting blog failed:", error.response?.data || errorMessage);

    return {
      success: false,
      message: `Failed to delete blog with ID ${id}: ${errorMessage}`,
      data: null,
      error: error.response?.data || errorMessage,
    };
  }
};

export const updateBlog = async (id, blogData, coverImageFile) => {
  if (!id) {
    return {
      success: false,
      message: "Blog ID is required for update.",
      data: null,
    };
  }

  try {
    const formData = new FormData();

    formData.append("blog", JSON.stringify(blogData));

    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    }

    const response = await axios.put(`/api/updateBlog/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Blog updated successfully!",
      updatedId: payload?.updatedId || id,
      data: payload?.data || {},
    };
  } catch (error) {
    console.error(
      "Updating blog failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        `An error occurred while updating blog with ID ${id}.`,
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Fetch a single blog by slug
export const getBlogBySlug = async (slug) => {
  if (!slug || typeof slug !== "string") {
    return {
      success: false,
      message: "Invalid or missing blog slug.",
      data: null,
    };
  }

  try {
    const response = await axios.get(`/api/getslug/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Blog retrieved successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error(
      `Fetching blog with slug "${slug}" failed:`,
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        `An error occurred while fetching blog with slug "${slug}".`,
      error: error.response?.data || error.message,
      data: null,
    };
  }
};


export const addBlogComment = async (commentData) => {
  try {
    const response = await axios.post("/api/addcomment", commentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Comment added successfully!",
      insertId: payload?.insertId || null,
    };
  } catch (error) {
    console.error("Adding comment failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while adding the comment.",
      error: error.response?.data || error.message,
    };
  }
};


export const getCommentsByBlogId = async (blog_id) => {
  if (!blog_id || (typeof blog_id !== "string" && typeof blog_id !== "number")) {
    return {
      success: false,
      message: "Invalid or missing blog ID.",
      data: [],
    };
  }

  try {
    const response = await axios.get(`/api/getcomment/${blog_id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Comments retrieved successfully!",
      data: Array.isArray(payload?.data) ? payload.data : [],
    };
  } catch (error) {
    console.error("Fetching comments failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching comments.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};

// Increment blog views by ID
export const incrementBlogViews = async (id) => {
  if (!id || isNaN(id)) {
    return {
      success: false,
      message: "Invalid or missing blog ID.",
    };
  }

  try {
    const response = await axios.put(`/api/increment-views/${id}`);

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Blog views incremented successfully!",
      updatedId: payload?.updatedId || id,
    };
  } catch (error) {
    console.error(
      `Incrementing views for blog ID ${id} failed:`,
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        `An error occurred while incrementing views for blog ID ${id}.`,
      error: error.response?.data || error.message,
    };
  }
};

