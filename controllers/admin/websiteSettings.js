const asyncHandler = require("../../middleWare/asyncHandler");
const {
  getWebsiteSettings,
  updateWebsiteSettings,
  addWebsiteAvatar,
} = require("../../utilities/general");

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

const updateWebsiteSettingsController = asyncHandler(async (req, res) => {
  console.log("Incoming request to update website settings");

  try {
    let fieldsToUpdate = {};

    if (req.body && Object.keys(req.body).length > 0) {
      fieldsToUpdate = { ...req.body };
    }

    if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const result = await updateWebsiteSettings(fieldsToUpdate);

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

const addWebsiteAvatarController = asyncHandler(async (req, res) => {
  console.log("Incoming request to add website avatar");

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No avatar file uploaded.",
    });
  }

  try {
    const avatarPath = `/uploads/${req.files[0].filename}`;
    const result = await addWebsiteAvatar(avatarPath);

    return res.status(result.success ? 201 : 500).json({
      success: result.success, // <--- this must be TRUE if avatar was saved
      message: result.message || "Website avatar added successfully",
      data: result.success ? { avatar: avatarPath, ...result.data } : null,
    });
  } catch (error) {
    console.error("Exception in addWebsiteAvatarController:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error adding website avatar.",
      data: null,
    });
  }
});

module.exports = {
  fetchWebsiteSettings,
  updateWebsiteSettingsController,
  addWebsiteAvatarController,
};
