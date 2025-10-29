require("dotenv").config();
const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
  console.error("Missing PAYSTACK_SECRET_KEY in environment variables");
  throw new Error("Missing PAYSTACK_SECRET_KEY in environment variables");
}

// Create authenticated Axios instance
const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

async function initializePayment(data) {
  try {
    if (!data.email || !data.amount) {
      console.error("Missing required fields:", { email: data.email, amount: data.amount });
      throw new Error("Email and amount are required to initialize payment");
    }

    if (isNaN(data.amount)) {
      console.error("Invalid amount provided:", data.amount);
      throw new Error("Invalid amount value — must be a number");
    }

    const response = await paystack.post("/transaction/initialize", data);

    if (!response.data || !response.data.status) {
      console.error("Unexpected Paystack response:", response.data);
      throw new Error("Invalid response from Paystack");
    }

    return response.data;
  } catch (error) {
    console.error("Paystack initialization error:", error.message);
    console.error("Error response data:", error.response?.data || "No response data");

    return {
      status: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to initialize payment",
      data: error.response?.data || null,
    };
  }
}


async function verifyTransaction(reference) {
  try {
    if (!reference) {
      throw new Error("Transaction reference is required to verify payment");
    }

    const response = await paystack.get(`/transaction/verify/${reference}`);

    if (!response.data || !response.data.status) {
      console.error("Unexpected Paystack verification response:", response.data);
      throw new Error("Invalid response from Paystack verification");
    }

    return response.data;
  } catch (error) {
    console.error("Paystack verification error:", error.message);
    console.error("Error response data:", error.response?.data || "No response data");

    return {
      status: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to verify transaction",
      data: error.response?.data || null,
    };
  }
}

module.exports = { initializePayment, verifyTransaction };
