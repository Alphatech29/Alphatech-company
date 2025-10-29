const sendEmail = require("../../email/transporter/transpoter");
const ejs = require("ejs");
const path = require("path");
const { getWebsiteSettings } = require("../../utilities/general");

// Format customer name properly
function formatName(name) {
  if (!name) return "Valued Customer";
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Format time to 12-hour format with AM/PM
function formatTime(time) {
  if (!time) return "";
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

// Format amount with ₦ and comma separators
function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return "₦0.00";
  return `₦${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Send admin consultation booking notification
async function sendAdminBookingNotification({
  full_name,
  email,
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

    // Define path to the admin EJS template
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "adminConsultation.ejs"
    );

    // Render admin email template
    const adminHtml = await ejs.renderFile(templatePath, {
      full_name: formatName(full_name),
      email,
      date,
      time: formattedTime,
      duration,
      mode,
      cost: formattedCost,
      transaction_id,
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
    });

    // Send admin notification email
    await sendEmail({
      from: `"${settings.site_name}" <${settings.admin_email}>`,
      to: settings.admin_email,
      subject: `New Consultation Booking: ${formatName(full_name)} on ${date} | ${settings.site_name}`,
      html: adminHtml,
    });

    console.log(`Admin notification email sent successfully to ${settings.admin_email}`);
  } catch (error) {
    console.error("Failed to send admin booking notification email:", error.message);
    throw error;
  }
}

module.exports = sendAdminBookingNotification;
