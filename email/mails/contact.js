const sendEmail = require("../../email/transporter/transpoter");
const ejs = require("ejs");
const path = require("path");
const { getWebsiteSettings } = require("../../utilities/general");

function formatName(name) {
  if (!name) return "N/A";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDateTime(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true,
  });
}

async function sendAdminContactNotification({
  name,
  email,
  subject,
  message,
  submissionDate = new Date(),
}) {
  try {
    // Retrieve website settings
    const settingsArray = await getWebsiteSettings();
    if (!settingsArray || !settingsArray.length) {
      throw new Error("Website settings not found.");
    }

    const settings = settingsArray[0];

    // Path to EJS template
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "contact.ejs"
    );

    // Render the EJS HTML template
    const html = await ejs.renderFile(templatePath, {
      name: formatName(name),
      email,
      subject,
      message,
      submissionDate: formatDateTime(submissionDate),
      site_name: settings.site_name,
      site_url: settings.site_url,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
    });

    // Send the notification email to admin
    await sendEmail({
      from: `"${settings.site_name}" <${settings.admin_email}>`,
      to: settings.admin_email,
      subject: `📬 New Contact Submission - ${formatName(name)}`,
      html,
    });

    console.log(`Contact message from ${name} sent to admin.`);
  } catch (error) {
    console.error("Failed to send contact notification:", error.message);
    throw error;
  }
}

module.exports = sendAdminContactNotification;
