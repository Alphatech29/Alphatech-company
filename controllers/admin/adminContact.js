const { addContactForm, getAllContactForms, deleteContactForm } = require("../../utilities/contact");
const sendUserOutgoingEmail = require("../../email/mails/outGoing");

// Controller to handle adding a new contact form submission
const createContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
        data: null,
      });
    }

    const response = await addContactForm(name, email, subject, message);

    if (response.success) {
      try {
        await sendUserOutgoingEmail({
          name,
          email,
          subject,
          message,
        });

        console.log(" Contact form email sent successfully to user.");
      } catch (userEmailError) {
        console.error(" Failed to send email to user:", userEmailError);
      }
    }

    return res.status(response.success ? 201 : 500).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Controller to handle fetching all contact form submissions
const fetchAllContactForms = async (req, res) => {
  try {
    const response = await getAllContactForms();
    return res.status(response.success ? 200 : 500).json(response);
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};


const removeContactForm = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact form ID is required",
        data: null,
      });
    }

    const response = await deleteContactForm(id);
    return res.status(response.success ? 200 : 404).json(response);
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
  createContactForm,
  fetchAllContactForms,
  removeContactForm,
};
