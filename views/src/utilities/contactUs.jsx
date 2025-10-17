import axios from "axios";

// -------------------- Fetch all contact form entries --------------------
export const getContactForms = async () => {
  try {
    const response = await axios.get("/api/contact", {
      headers: { "Content-Type": "application/json" },
    });

    const payload = Array.isArray(response.data) ? response.data[0] : response.data;
    const contactData = Array.isArray(payload?.data) ? payload.data : [];

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Contact forms retrieved successfully!",
      data: contactData,
    };
  } catch (error) {
    console.error("Fetching contact forms failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching contact forms.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};

// -------------------- Submit a new contact form entry --------------------
export const submitContactForm = async ({ name, email, subject, message }) => {
  try {
    const response = await axios.post(
      "/api/create-contact",
      { name, email, subject, message },
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Contact form submitted successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Submitting contact form failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while submitting the contact form.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};

// -------------------- Submit a new admin contact form entry --------------------
export const submitAdminContactForm = async (formData) => {
  try {
    // Log the payload before sending
    console.log("Submitting full contact form payload:", formData);

    const response = await axios.post(
      "/api/send-message",
      formData, // send all fields dynamically
      { headers: { "Content-Type": "application/json" } }
    );

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Contact form submitted successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error(
      "Submitting contact form failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while submitting the contact form.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};


// -------------------- Delete a contact form entry --------------------
export const deleteContactForm = async (id) => {
  try {
    if (!id) throw new Error("Contact form ID is required.");

    const response = await axios.delete(`/api/remove/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? true,
      message: payload?.message || "Contact form deleted successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error("Deleting contact form failed:", error.response?.data || error.message);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while deleting the contact form.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};
