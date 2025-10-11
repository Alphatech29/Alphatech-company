import axios from "axios";

export const createTestimony = async (testimonyData) => {
  try {
    const response = await axios.post(
      "/api/createTestimony",
      testimonyData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message:
        payload?.message || "Testimony created successfully!",
      data: payload,
    };
  } catch (error) {
    console.error(
      "Creating testimony failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while creating the testimony.",
      error: error.response?.data || error.message,
    };
  }
};


export const getTestimonies = async () => {
  try {
    const response = await axios.get("/api/get-testimony", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    const testimoniesData = Array.isArray(payload?.data)
      ? payload.data
      : [];

    return {
      success: payload?.success ?? false,
      message:
        payload?.message || "Testimonies retrieved successfully!",
      data: testimoniesData,
    };
  } catch (error) {
    console.error(
      "Fetching testimonies failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching testimonies.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};


export const deleteTestimony = async (id) => {

  try {

    const response = await axios.delete(`/api/delete-testimony/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Testimony deleted successfully!",
      data: payload,
    };
  } catch (error) {
    console.error(
      "Deleting testimony failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while deleting the testimony.",
      error: error.response?.data || error.message,
    };
  }
};
