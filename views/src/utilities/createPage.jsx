import axios from "axios";

// Create new page
export const addPageData = async (title, slug, description, content) => {
  try {
    const response = await axios.post(
      "/api/create-page",
      { title, slug, description, content },
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success || false,
      message: payload?.message || "",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Creating page failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Error creating page",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Fetch all pages
export const getPagesData = async () => {
  try {
    const response = await axios.get("/api/get-page", {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success || false,
      message: payload?.message || "",
      data: payload?.data || [],
    };
  } catch (error) {
    console.error("Fetching pages failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch pages",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};

// Fetch page by ID
export const getPageById = async (id) => {
  try {
    const response = await axios.get(`/api/get-page/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success || false,
      message: payload?.message || "",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Fetching page by ID failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch page",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Fetch page by SLUG
export const getPageBySlug = async (slug) => {
  try {
    const response = await axios.get(`/api/page/${slug}`, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success || false,
      message: payload?.message || "",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Fetching page by slug failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Unable to fetch page by slug",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Update page
export const updatePageData = async (id, { title, slug, description, content }) => {
  try {
    const response = await axios.put(
      `/api/page-edit/${id}`,
      { title, slug, description, content },
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success || false,
      message: payload?.message || "",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Updating page failed:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.message || "Unable to update page",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};
