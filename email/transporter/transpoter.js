const nodemailer = require("nodemailer");
const logger = require("../../middleWare/logger");
const { getWebsiteSettings } = require("../../utilities/general");

// Initialize transporter immediately as a Promise
const transporterPromise = (async () => {
  try {
    const settingsArray = await getWebsiteSettings();
    const settings = settingsArray?.[0];

    if (!settings || !settings.smtp_host || !settings.smtp_user || !settings.smtp_password) {
      console.error("SMTP configuration incomplete:", settings);
      throw new Error("SMTP configuration is incomplete");
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: settings.smtp_host,
      port: parseInt(settings.smtp_port, 10),
      secure: settings.smtp_port == 465,
      auth: {
        user: settings.smtp_user,
        pass: settings.smtp_password,
      },
      tls: { rejectUnauthorized: false },
    });

    // Verify transporter
    await transporter.verify();
    console.log("Transporter verified successfully");

    return transporter;
  } catch (error) {
    logger.error(`Failed to setup transporter: ${error.stack}`);
    console.error("Transporter verification failed. Check credentials, host, and port.", error);
    throw new Error("SMTP transporter verification failed. Check credentials and host/port.");
  }
})();

// Function to send email directly
const sendEmail = async (mailOptions) => {
  try {
    const transporter = await transporterPromise;
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${mailOptions.to}`);
  } catch (error) {
    logger.error(`Failed to send email to ${mailOptions.to}: ${error.message}`);
    console.error("Error details:", error);
    throw error;
  }
};

module.exports = sendEmail;
