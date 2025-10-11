import axios from "axios";

export const loginAdmin = async (identifier, password) => {
  try {
    const response = await axios.post(
      `/auth/login`,
      { identifier, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { success, message, token, data } = response.data;

    console.log("Login response:", response.data);

    return {
      success,
      message,
      token,
      data: data || null,
    };
  } catch (error) {
    console.error("Login failed:", error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
      error: error.response?.data,
    };
  }
};
