const asyncHandler = require("../../middleWare/asyncHandler");
const {
  getFounders,
  addFounder,
  updateFounder,
  deleteFounder,
} = require("../../utilities/founder");

// GET /founders
const fetchFounders = asyncHandler(async (req, res) => {
  console.log(" Fetching founders list...");

  try {
    const result = await getFounders();
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error(" Controller error (fetchFounders):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
});

// POST /founders
const createFounder = asyncHandler(async (req, res) => {
  console.log(" Incoming request to create founder");

  try {
    let founderData;

    // Parse JSON if wrapped in "founder"
    try {
      founderData = req.body.founder
        ? JSON.parse(req.body.founder)
        : req.body;
    } catch (err) {
      console.error(" Invalid JSON format in founder field:", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in founder field.",
        error: err.message,
      });
    }

    // Handle avatar upload
    founderData.avatar =
      req.files && req.files.length > 0
        ? `/uploads/${req.files[0].filename}`
        : null;

    // Validate required fields
    if (!founderData.full_name || !founderData.email || !founderData.role) {
      console.warn(" Missing required fields:", {
        full_name: founderData.full_name,
        email: founderData.email,
        role: founderData.role,
      });

      return res.status(400).json({
        success: false,
        message: "Full name, Email, and Role are required.",
      });
    }

    const result = await addFounder(
      founderData.full_name,
      founderData.avatar,
      founderData.email,
      founderData.role,
      founderData.bio
    );

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message || "Founder added successfully.",
        insertId: result.insertId,
        data: { id: result.insertId, ...founderData },
      });
    }

    console.error(" Failed Response:", result);
    return res.status(500).json({
      success: false,
      message: result.message || "Failed to add founder.",
    });
  } catch (err) {
    console.error(" Exception in createFounder controller:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
});

// PUT /founders/:id
const modifyFounder = asyncHandler(async (req, res) => {
  console.log("Incoming request to update founder");

  try {
    const { id } = req.params;
    let updatedData;

    // Parse JSON if wrapped inside "founder"
    try {
      updatedData = req.body.founder
        ? JSON.parse(req.body.founder)
        : req.body;

      console.log("Parsed incoming data:", updatedData); // <--- log the data here
    } catch (err) {
      console.error("Invalid JSON format (modifyFounder):", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in founder field.",
        error: err.message,
      });
    }

    // Handle avatar update
    updatedData.avatar =
      req.files && req.files.length > 0
        ? `/uploads/${req.files[0].filename}`
        : updatedData.avatar || null;

    console.log("Final data to update:", updatedData); // <--- log after avatar handling

    const result = await updateFounder(
      id,
      updatedData.full_name,
      updatedData.avatar,
      updatedData.email,
      updatedData.role,
      updatedData.bio
    );

    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error("Controller error (modifyFounder):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
});


// DELETE /founders/:id
const removeFounder = asyncHandler(async (req, res) => {
  console.log(" Incoming request to remove founder");

  try {
    const { id } = req.params;
    const result = await deleteFounder(id);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    console.error(" Controller error (removeFounder):", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  fetchFounders,
  createFounder,
  modifyFounder,
  removeFounder,
};
