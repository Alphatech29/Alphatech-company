const { insertTestimony, getTestimonies, deleteTestimonyById } = require("../../utilities/testimonies");

//Create a new testimony
async function createTestimony(req, res) {
  try {
    const { name, position, message, rating } = req.body;

    // Basic validation
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required fields.",
      });
    }

    if (rating && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 10.",
      });
    }

    // Insert testimony into the database
    const result = await insertTestimony({ name, position, message, rating });

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        testimonyId: result.insertId,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to insert testimony record.",
      });
    }
  } catch (error) {
    console.error("Controller error (createTestimony):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// Get all testimonies
async function fetchTestimonies(req, res) {
  try {
    const result = await getTestimonies();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve testimonies.",
        data: [],
      });
    }
  } catch (error) {
    console.error("Controller error (fetchTestimonies):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
}

async function removeTestimonyById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Testimony ID is required.",
      });
    }

    const result = await deleteTestimonyById(id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message || "Testimony not found.",
      });
    }
  } catch (error) {
    console.error("Controller error (removeTestimonyById):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}



module.exports = {
  createTestimony,
  fetchTestimonies,
  removeTestimonyById,
};
