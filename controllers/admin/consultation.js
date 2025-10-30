const { initializePayment, verifyTransaction } = require("../../utilities/paystack");
const { getWebsiteSettings } = require("../../utilities/general");
const {getAllConsultationBookings, getConsultationBookingById, updateConsultationBookingDateTime} = require("../../utilities/consultation");
const sendConsultationPreparedEmail = require("../../email/mails/consultationPrepared");
const sendConsultationRescheduleEmail = require("../../email/mails/consultationReschedule");

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


async function consultationPrepared(req, res) {
  try {
    const { id, consultation_link } = req.body;

    if (!id || !consultation_link) {
      console.warn("Validation failed: Missing required fields.");
      return res.status(400).json({
        success: false,
        message: "Missing consultation ID or consultation link.",
      });
    }

    // Fetch the consultation booking by ID
    const bookingResult = await getConsultationBookingById(id);

    if (!bookingResult || !bookingResult.success) {
      console.warn(`Booking not found or error for id ${id}`);
      return res.status(404).json({
        success: false,
        message: bookingResult?.message || "Consultation booking not found.",
      });
    }

    const booking = bookingResult.data;

    const requiredFields = [
      "full_Name",
      "email",
      "date",
      "time",
      "duration",
      "mode",
      "cost",
    ];

    for (const field of requiredFields) {
      if (!booking[field]) {
        console.warn(`Missing required booking field: ${field}`);
        return res.status(400).json({
          success: false,
          message: `Booking is missing required field: ${field}`,
        });
      }
    }

    // Send the consultation prepared email
    const emailResult = await sendConsultationPreparedEmail({
      full_name: booking.full_Name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      mode: booking.mode,
      consultation_link,
      cost: booking.cost,
    });

    if (!emailResult || !emailResult.success) {
      console.error(`Failed to send email to ${booking.email}:`, emailResult?.error || "Unknown error");
      return res.status(500).json({
        success: false,
        message: "Failed to send consultation email.",
        error: emailResult?.error || "Unknown error occurred while sending email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation Prepared email sent successfully.",
    });
  } catch (error) {
    console.error("Error in consultationPrepared:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send consultation reply.",
      error: error.message,
    });
  }
}

async function updateConsultationBooking(req, res) {
  try {
    const { id, date, time } = req.body;

    // Validate required fields
    if (!id || !date || !time) {
      console.warn("Validation failed: Missing required fields.");
      return res.status(400).json({
        success: false,
        message: "Missing consultation ID, date, or time.",
      });
    }

    // Update the booking in the database
    const updateResult = await updateConsultationBookingDateTime(id, date, time);

    if (!updateResult.success) {
      console.warn(`Failed to update booking with id ${id}:`, updateResult.message);
      return res.status(404).json({
        success: false,
        message: updateResult.message || "Failed to update consultation booking.",
      });
    }

    // Fetch the updated booking details
    const bookingResult = await getConsultationBookingById(id);
    if (!bookingResult.success) {
      console.warn(`Booking not found after update for id ${id}`);
      return res.status(404).json({
        success: false,
        message: "Updated consultation booking not found.",
      });
    }

    const booking = bookingResult.data;

    // Send the consultation reschedule email
    const emailResult = await sendConsultationRescheduleEmail({
      full_name: booking.full_Name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      duration: booking.duration,
      mode: booking.mode,
    });

    if (!emailResult.success) {
      console.error(`Failed to send reschedule email to ${booking.email}:`, emailResult.error);
      // We return success for the update but notify email sending failed
      return res.status(200).json({
        success: true,
        message: "Consultation booking updated, but failed to send reschedule email.",
        emailError: emailResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Consultation booking updated and reschedule email sent successfully.",
    });

  } catch (error) {
    console.error("Error in updateConsultationBooking:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating the consultation booking.",
      error: error.message,
    });
  }
}


module.exports = {
  createConsultationBooking,
  verifyConsultationTransaction,
  fetchAllConsultationBookings,
  consultationPrepared,
  updateConsultationBooking,
};

