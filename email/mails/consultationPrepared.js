const sendEmail = require("../transporter/transpoter");
const ejs = require("ejs");
const path = require("path");
const { getWebsiteSettings } = require("../../utilities/general");

function formatName(name) {
  if (!name) return "Valued Client";
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatTimeTo12Hour(timeStr) {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatCost(amount, currency = "$") {
  if (typeof amount === "number") {
    return `${currency}${amount.toLocaleString()}`;
  }
  return amount;
}

async function sendConsultationPreparedEmail({
  full_name,
  email,
  date,
  time,
  duration,
  mode,
  consultation_link,
  cost,
  subject = "Your Consultation Details Are Ready",
}) {
  try {
    // Retrieve website settings
    const settingsArray = await getWebsiteSettings();
    if (!settingsArray || !settingsArray.length) {
      throw new Error("Website settings not found.");
    }
    const settings = settingsArray[0];

    // Define path to the EJS template
    const templatePath = path.join(
      process.cwd(),
      "email",
      "templates",
      "consultationPrepared.ejs"
    );

    // Render EJS template
    const html = await ejs.renderFile(templatePath, {
      full_name: formatName(full_name),
      date,
      time: formatTimeTo12Hour(time),
      duration,
      mode,
      consultation_link,
      cost: formatCost(cost, settings.currency),
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
    });

    // Send email
    await sendEmail({
      from: `"${settings.site_name}" <${settings.admin_email}>`,
      to: email,
      subject: `${subject} | ${settings.site_name}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send consultation prepared email:", error.message);

    return { success: false, error: error.message || "Unknown error" };
  }
}

module.exports = sendConsultationPreparedEmail;
