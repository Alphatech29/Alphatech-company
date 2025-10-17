const sendEmail = require("../../email/transporter/transpoter");
const ejs = require("ejs");
const path = require("path");
const { getWebsiteSettings } = require("../../utilities/general");

function formatName(name) {
  if (!name) return "Valued Customer";
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function sendUserOutgoingEmail({ receiver_name, email, subject, message, sender_name, sender_position }) {
  try {
    // Load website settings
    const settingsArray = await getWebsiteSettings();
    if (!settingsArray || !settingsArray.length) {
      throw new Error("Website settings not found.");
    }

    const settings = settingsArray[0];

    // Define EJS template path
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "outGoing.ejs"
    );

    // Render email template with dynamic data
    const html = await ejs.renderFile(templatePath, {
      receiver_name: formatName(receiver_name),
      email,
      message,
      subject,
      sender_name: formatName(sender_name),
      sender_position,
      site_name: settings.site_name,
      site_url: settings.site_url,
      avatar: settings.avatar,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      address: settings.address,
      facebook: settings.facebook,
      twitter: settings.twitter,
      instagram: settings.instagram,
      tiktok: settings.tiktok,
      linkedin: settings.linkedin,
      unsubscribe_link: "#",
    });

    // Send email
    await sendEmail({
      from: `"${settings.site_name}" <${settings.admin_email}>`,
      to: email,
      subject: `${subject || "No Subject"} | ${settings.site_name}`,
      html,
    });

    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("Failed to send AlphaTech email:", error.message);
    throw error;
  }
}

module.exports = sendUserOutgoingEmail;
