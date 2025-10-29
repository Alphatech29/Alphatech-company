const crypto = require("crypto");
const { insertConsultationBooking } = require("../utilities/consultation");
const sendBookingConfirmationEmail = require("../email/mails/consultation");
const sendAdminBookingNotification = require("../email/mails/adminConsultation");

const PAYSTACK_IPS = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

async function paystackWebhook(req, res) {
  try {
    const requestIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.connection.remoteAddress;

    if (!PAYSTACK_IPS.includes(requestIP)) {
      console.warn(`Unauthorized IP: ${requestIP}`);
      return res.status(403).json({ success: false, message: "Forbidden: Invalid source IP" });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.warn("Invalid Paystack signature");
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }

    // Acknowledge Paystack immediately
    res.status(200).send("Webhook received");

    const event = req.body;

    if (event.event === "charge.success" && event.data.status === "success") {
      try {
        const metadata = event.data.metadata || {};

        const bookingData = {
          full_name: metadata.fullName || "",
          email: event.data.customer?.email || metadata.email || "",
          company: metadata.company || "",
          role: metadata.role || "",
          phone: metadata.phone || "",
          whatsapp: metadata.whatsapp || "",
          country: metadata.country || "",
          location: metadata.location || "",
          address: metadata.address || "",
          mode: metadata.mode || "",
          date: metadata.date || "",
          time: metadata.time || "",
          duration: metadata.duration || "",
          cost: event.data.amount / 100,
          reference_websites: metadata.referenceWebsites || "",
          project_details: metadata.projectDetails || "",
          status: 1,
          payment_reference: event.data.reference,
          transaction_id: event.data.id,
        };

        // Insert booking into the database
        const result = await insertConsultationBooking(bookingData);

        if (result?.success) {

          // Send confirmation email to customer
          if (bookingData.email && /\S+@\S+\.\S+/.test(bookingData.email)) {
            await sendBookingConfirmationEmail({
              full_name: bookingData.full_name,
              email: bookingData.email,
              subject: "Congratulation Booking Consultation Successful",
              date: bookingData.date,
              time: bookingData.time,
              duration: bookingData.duration,
              mode: bookingData.mode,
              cost: bookingData.cost,
              transaction_id: bookingData.transaction_id,
            });
          } else {
            console.warn("No valid email found; skipping customer email.", bookingData);
          }

          //  Send admin notification email
          try {
            await sendAdminBookingNotification({
              full_name: bookingData.full_name,
              email: bookingData.email,
              date: bookingData.date,
              time: bookingData.time,
              duration: bookingData.duration,
              mode: bookingData.mode,
              cost: bookingData.cost,
              transaction_id: bookingData.transaction_id,
            });
          } catch (adminMailError) {
            console.error("Failed to send admin notification email:", adminMailError.message);
          }

        } else {
          console.error("Booking insertion failed:", result?.message || "Unknown error");
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
      }
    } else {
      console.log(`Ignored event: ${event.event} with status: ${event.data?.status}`);
    }
  } catch (error) {
    console.error("Error in Paystack webhook handler:", error);
  }
}

module.exports = { paystackWebhook };
