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

function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
}


function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return "₦0.00";
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function sendBookingConfirmationEmail({
  full_name,
  email,
  subject = "Congratulation Booking Consultation Successful",
  date,
  time,
  duration,
  mode,
  cost,
  transaction_id,
}) {
  try {
    const settingsArray = await getWebsiteSettings();
    if (!settingsArray || !settingsArray.length) {
      throw new Error("Website settings not found.");
    }

    const settings = settingsArray[0];

    // Apply formatting
    const formattedTime = formatTime(time);
    const formattedCost = formatAmount(cost);

    // Define path to the EJS template
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "consultation.ejs"
    );

    // Render the EJS HTML template
    const html = await ejs.renderFile(templatePath, {
      full_name: formatName(full_name),
      date,
      time: formattedTime,
      duration,
      mode,
      cost: formattedCost,
      transaction_id,
      subject,
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

    // Send email via your configured transporter
    await sendEmail({
      from: `"${settings.site_name}" <${settings.admin_email}>`,
      to: email,
      subject: `${subject} | ${settings.site_name}`,
      html,
    });

    console.log(`Booking confirmation email sent successfully to ${email}`);
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error.message);
    throw error;
  }
}

module.exports = sendBookingConfirmationEmail;
