import axios from "axios";

export const createConsultationBooking = async (formData) => {
  try {
    const response = await axios.post("/api/consultation", formData, {
      headers: { "Content-Type": "application/json" },
    });

    const {
      success = false,
      message = "",
      authorization_url = "",
      reference = "",
    } = response.data || {};

    return {
      success,
      message,
      authorization_url,
      reference,
      raw: response.data,
    };
  } catch (error) {
    console.error(
      "Consultation booking failed:",
      error.response?.data || error.message
    );

    const { message = "Error creating consultation booking" } =
      error.response?.data || {};

    return {
      success: false,
      message,
      authorization_url: null,
      reference: null,
      error: error.response?.data || null,
    };
  }
};


export const verifyConsultationTransaction = async (reference) => {
  try {
    if (!reference) throw new Error("Transaction reference is required for verification.");

    console.log("Sending transaction verification request for reference:", reference);

    const response = await axios.get(`/api/verify-transaction?reference=${reference}`);

    console.log("Received response from backend:", response.data);

    const result = {
      success: response.data?.success,
      message: response.data?.message,
      data: response.data?.data,
      raw: response.data,
    };

    console.log("Returning to caller:", result);
    return result;
  } catch (error) {
    console.error(
      "Transaction verification failed:",
      error.response?.data || error.message
    );

    const errorResult = {
      success: false,
      message: error.response?.data?.message || error.message,
      data: null,
      error: error.response?.data,
    };

    console.log("Returning error to caller:", errorResult);
    return errorResult;
  }
};


export const getAllConsultationBookings = async () => {
  try {
    const response = await axios.get("/api/get-consultation");

    const { success = false, message = "", data = [] } = response.data || {};

    return {
      success,
      message,
      data,
      raw: response.data,
    };
  } catch (error) {
    console.error(
      "Fetching consultation bookings failed:",
      error.response?.data || error.message
    );

    const { message = "Error fetching consultation bookings" } =
      error.response?.data || {};

    return {
      success: false,
      message,
      data: [],
      error: error.response?.data || null,
    };
  }
};

