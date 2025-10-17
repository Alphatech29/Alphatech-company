const pool = require("../model/db");

// Add a new contact form entry
async function addContactForm({
  receiver_name,
  email,
  subject,
  message,
  sender_position,
  sender_name,
}) {
  try {
    const query = `
      INSERT INTO contact_form
        (receiver_name, sender_name, sender_position, email, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [receiver_name, sender_name, sender_position, email, subject, message];

    const [result] = await pool.query(query, values);

    return {
      success: true,
      message: "Contact form submitted successfully",
      data: {
        id: result.insertId,
        receiver_name,
        sender_name,
        sender_position,
        email,
        subject,
        message,
      },
    };
  } catch (error) {
    console.error("Error inserting contact form data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Fetch all contact form entries
async function getAllContactForms() {
  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        receiver_name,
        email, 
        subject, 
        message, 
        sender_position, 
        sender_name,
        created_at
       FROM contact_form 
       ORDER BY created_at DESC`
    );

    return {
      success: true,
      message: "Contact forms retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching contact form data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

// Delete a contact form entry by ID
async function deleteContactForm(id) {
  try {
    const [result] = await pool.query(`DELETE FROM contact_form WHERE id = ?`, [
      id,
    ]);

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "No contact form found with the given ID",
        data: null,
      };
    }

    return {
      success: true,
      message: "Contact form deleted successfully",
      data: { id },
    };
  } catch (error) {
    console.error("Error deleting contact form data:", error);
    return {
      success: false,
      message: "Internal Server Error",
      data: null,
    };
  }
}

module.exports = { addContactForm, getAllContactForms, deleteContactForm };
