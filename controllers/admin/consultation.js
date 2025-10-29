const { initializePayment, verifyTransaction } = require("../../utilities/paystack");
const { getWebsiteSettings } = require("../../utilities/general");
const {getAllConsultationBookings} = require("../../utilities/consultation");

async function createConsultationBooking(req, res) {
  try {

    const {
      fullName,
      email,
      company,
      role,
      phone,
      whatsapp,
      country,
      location,
      address,
      mode,
      date,
      time,
      duration,
      cost,
      referenceWebsites,
      projectDetails,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      fullName,
      email,
      company,
      role,
      phone,
      country,
      location,
      address,
      mode,
      date,
      time,
      duration,
      cost,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.warn("Missing required fields from frontend:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    // Clean and validate amount
    const cleanAmount = Number(String(cost).replace(/[₦,\s]/g, ""));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      console.warn("Invalid cost value received from frontend:", cost);
      return res.status(400).json({
        success: false,
        message: "Invalid cost value. Please provide a valid number (e.g., 15000).",
      });
    }

    // Fetch site URL dynamically from website settings
    const settings = await getWebsiteSettings();
    const site_url = settings?.site_url?.trim().replace(/\/$/, "");

    // Prepare Paystack payment data
    const paymentData = {
      email,
      amount: cleanAmount * 100,
      callback_url: `${site_url}/book-a-consultation`,
      metadata: {
        fullName,
        company,
        role,
        phone,
        whatsapp,
        country,
        location,
        address,
        mode,
        date,
        time,
        duration,
        cost,
        referenceWebsites,
        projectDetails,
      },
    };

    const paymentResponse = await initializePayment(paymentData);

    if (!paymentResponse.status) {
      console.error("Failed to initialize payment with Paystack");
      return res.status(400).json({
        success: false,
        message:
          paymentResponse.message || "Failed to initialize payment with Paystack.",
        data: paymentResponse.data || null,
      });
    }

    // Successful payment initialization
    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully. Redirect user to Paystack.",
      authorization_url: paymentResponse.data.authorization_url,
      reference: paymentResponse.data.reference,
    });
  } catch (error) {
    console.error("Error in createConsultationBooking:", error.message);
    console.error("Full error details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during payment initialization.",
      error: error.message,
    });
  }
}


async function verifyConsultationTransaction(req, res) {
  try {

    const { reference } = req.query;

    // Validate transaction reference
    if (!reference) {
      console.warn("Missing transaction reference from frontend.");
      return res.status(400).json({
        success: false,
        message: "Transaction reference is required for verification.",
      });
    }

    // Verify transaction with Paystack
    const verificationResponse = await verifyTransaction(reference);

    // Check if verification call failed
    if (!verificationResponse || !verificationResponse.status) {
      console.error(
        "Failed to verify transaction with Paystack:",
        verificationResponse?.message || "Unknown error"
      );
      return res.status(400).json({
        success: false,
        message: verificationResponse?.message || "Failed to verify transaction.",
        data: verificationResponse?.data || null,
      });
    }

    const transactionData = verificationResponse.data;

    // Check if payment was successful
    if (transactionData.status !== "success") {
      console.warn("Transaction not successful:", transactionData.status);
      return res.status(400).json({
        success: false,
        message: `Transaction status: ${transactionData.status}. Please try again.`,
        data: transactionData,
      });
    }

    // Extract metadata safely
    const metadata = transactionData.metadata || {};
    const responseData = {
      reference: transactionData.reference,
      amount: transactionData.amount / 100,
      currency: transactionData.currency,
      status: transactionData.status,
      customer: transactionData.customer,
      metadata,
    };

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Your consultation has been successfully booked. A confirmation has been sent to your email. Please check your inbox for updates.",
      data: responseData,
    });
  } catch (error) {
    console.error("Error in verifyConsultationTransaction:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during transaction verification.",
      error: error.message,
    });
  }
}



async function fetchAllConsultationBookings(req, res) {
  try {
    const result = await getAllConsultationBookings();

    if (!result.success) {
      console.error("Failed to fetch consultation bookings:", result.error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve consultation bookings.",
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation bookings retrieved successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in fetchAllConsultationBookings:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
}


module.exports = { createConsultationBooking, verifyConsultationTransaction, fetchAllConsultationBookings  };
