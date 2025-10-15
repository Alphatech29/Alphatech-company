import axios from "axios";

// Fetch all FAQs
export const getFaqsData = async () => {
  try {
    const response = await axios.get("/api/get-faqs", {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data) ? response.data[0] : response.data;

    const faqsData = Array.isArray(payload?.data) ? payload.data : [];

    return {
      success: payload?.success ?? false,
      message: payload?.message || "FAQs retrieved successfully!",
      data: faqsData,
    };
  } catch (error) {
    console.error("Fetching FAQs failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while fetching FAQs.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};

// Add a new FAQ
export const addFaqData = async (question, answer) => {
  try {
    const response = await axios.post(
      "/api/add-faqs",
      { question, answer },
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = Array.isArray(response.data) ? response.data[0] : response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "FAQ added successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Adding FAQ failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while adding FAQ.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Update FAQ by ID
export const updateFaqDataById = async (id, question, answer) => {
  try {
    const response = await axios.put(
      `/api/update-faqs/${id}`,
      { question, answer },
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = Array.isArray(response.data) ? response.data[0] : response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "FAQ updated successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Updating FAQ failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while updating FAQ.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// Delete FAQ by ID
export const deleteFaqDataById = async (id) => {
  try {
    const response = await axios.delete(`/api/delete-faq/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data) ? response.data[0] : response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "FAQ deleted successfully!",
    };
  } catch (error) {
    console.error("Deleting FAQ failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message || "An error occurred while deleting FAQ.",
      error: error.response?.data || error.message,
    };
  }
};
