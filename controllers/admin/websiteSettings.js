const asyncHandler = require("../../middleWare/asyncHandler");
const { getWebsiteSettings, updateWebsiteSettings } = require("../../utilities/general");

// Fetch website settings
const fetchWebsiteSettings = async (req, res) => {
  try {
    const settings = await getWebsiteSettings();

    if (!settings || settings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No website settings found.",
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching website settings:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching website settings.",
      error: error.message,
    });
  }
};


// Handles both JSON and multipart/form-data (FormData) requests
const updateWebsiteSettingsController = asyncHandler(async (req, res) => {
  console.log("Incoming request to update website settings");

  try {
    let fieldsToUpdate = {};

    // Parse JSON body if present
    if (req.body.settings) {
      try {
        fieldsToUpdate = JSON.parse(req.body.settings);
      } catch (err) {
        console.error("Invalid JSON format in settings field:", err.message);
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in settings field.",
          error: err.message,
        });
      }
    } else {
      // Direct JSON body
      fieldsToUpdate = req.body;
    }

    // Handle uploaded files (from multer)
    if (req.files && Object.keys(req.files).length > 0) {
      console.log("Uploaded files:", Object.keys(req.files));

      if (req.files.site_avatar && req.files.site_avatar[0]) {
        const file = req.files.site_avatar[0];
        fieldsToUpdate.site_avatar = `/uploads/${file.filename}`;
      }

      if (req.files.favicon && req.files.favicon[0]) {
        const file = req.files.favicon[0];
        fieldsToUpdate.favicon = `/uploads/${file.filename}`;
      }
    }

    console.log("Fields to update:", fieldsToUpdate);

    // Validate fields
    if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    // Update in database
    const result = await updateWebsiteSettings(fieldsToUpdate);
    console.log("Database update result:", result);

    // Send success response
    return res.status(200).json({
      success: true,
      message: result?.message || "Website settings updated successfully.",
      data: result?.data || fieldsToUpdate,
    });
  } catch (error) {
    console.error("Error updating website settings:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating website settings.",
      error: error.message,
    });
  } finally {
    console.log("updateWebsiteSettingsController request finished.");
  }
});

module.exports = {
  fetchWebsiteSettings,
  updateWebsiteSettingsController,
};
