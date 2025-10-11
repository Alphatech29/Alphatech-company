import axios from "axios";

export const getPortfolioData = async () => {
  try {
    const response = await axios.get("/api/portfolio", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    const portfolioData = Array.isArray(payload?.data)
      ? payload.data
      : [];

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Portfolio data retrieved successfully!",
      data: portfolioData,
    };
  } catch (error) {
    console.error(
      "Fetching portfolio data failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching portfolio data.",
      error: error.response?.data || error.message,
      data: [],
    };
  }
};


export const addPortfolioData = async (portfolioInfo) => {
  try {
    const response = await axios.post("/api/add-portfolio", portfolioInfo, {
      headers: {
        "Accept": "application/json",
      },
    });

    const payload = response.data || {};

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Portfolio added successfully!",
      data: payload?.data || {},
    };
  } catch (error) {
    console.error(
      "Adding portfolio data failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while adding portfolio data.",
      error: error.response?.data || error.message,
      data: {},
    };
  }
};