import axios from "axios";

export const getCeoBio = async () => {
  try {
    const response = await axios.get("/api/ceo-bio", {
      headers: { "Content-Type": "application/json" },
    });
    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    const ceoData = Array.isArray(payload?.data) ? payload.data : [];

    return {
      success: payload?.success ?? false,
      message: payload?.message || "CEO bio retrieved successfully!",
      data: ceoData,
    };
  } catch (error) {
    console.error(
      "Fetching CEO bio failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching CEO bio.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};
