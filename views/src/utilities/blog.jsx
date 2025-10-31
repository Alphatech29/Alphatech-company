import axios from "axios";

export const createBlog = async (blogData, coverImageFile) => {
  try {
    // Prepare FormData for file upload
    const formData = new FormData();

    // Append the blog JSON data
    formData.append("blog", JSON.stringify(blogData));

    // Append the cover image if available
    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    }

    // Send the request to backend
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

    // Validate and normalize response
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
    // Handle both Axios errors and generic errors
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

