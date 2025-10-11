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

// Update website settings
const updateWebsiteSettingsController = async (req, res) => {
  try {
    const fieldsToUpdate = req.body;

    if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const result = await updateWebsiteSettings(fieldsToUpdate);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error updating website settings:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating website settings.",
      error: error.message,
    });
  }
};

module.exports = {
  fetchWebsiteSettings,
  updateWebsiteSettingsController,
};
