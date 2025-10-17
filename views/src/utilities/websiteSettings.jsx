import axios from "axios";

export const getWebsiteSettings = async () => {
  try {
    const response = await axios.get("/api/websettings", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle both possible response shapes
    const data =
      Array.isArray(response.data)
        ? response.data[0]
        : response.data;

    const settings =
      data?.success && Array.isArray(data.data) ? data.data : [];

    return {
      success: true,
      message: "Website settings retrieved successfully!",
      data: settings,
    };
  } catch (error) {
    console.error(
      "Fetching website settings failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while fetching website settings.",
      error: error.response?.data || error.message,
    };
  }
};

export const updateWebsiteSettings = async (fieldsToUpdate) => {
  try {
    if (
      !fieldsToUpdate ||
      Object.keys(fieldsToUpdate).length === 0
    ) {
      throw new Error("No fields provided for update.");
    }


    const response = await axios.put("/api/update-field", fieldsToUpdate, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const payload = Array.isArray(response.data)
      ? response.data[0]
      : response.data;

    return {
      success: payload?.success ?? false,
      message: payload?.message || "Website settings updated successfully!",
      data: payload?.data || null,
    };
  } catch (error) {
    console.error(
      "Updating website settings failed:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "An error occurred while updating website settings.",
      error: error.response?.data || error.message,
      data: null,
    };
  }
};


