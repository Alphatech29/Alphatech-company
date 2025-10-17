const sendAdminContactNotification = require("../../email/mails/contact");


const createAdminContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
        data: null,
      });
    }

    try {
      await sendAdminContactNotification({
        name,
        email,
        subject: subject || "No Subject",
        message,
      });
      console.log("Admin notification email sent successfully.");

      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: null,
      });
    } catch (emailError) {
      console.error("Failed to send admin contact email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send admin notification email",
        data: null,
      });
    }
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};


module.exports = {
  createAdminContactForm,
};
