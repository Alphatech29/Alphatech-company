const asyncHandler = require("../../middleWare/asyncHandler");
const { getPortfolioData, insertPortfolio } = require("../../utilities/portfolio");


// Controller to insert a new portfolio record
const addPortfolioController = asyncHandler(async (req, res) => {
  console.log("📥 Incoming request to add portfolio");

  try {
    let portfolio;

    // Parse incoming data (handles JSON string in FormData)
    try {
      portfolio = req.body.portfolio
        ? JSON.parse(req.body.portfolio)
        : req.body;
    } catch (err) {
      console.error("⚠️ Invalid JSON format in portfolio field:", err.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in portfolio field.",
        error: err.message,
      });
    }

    // ✅ Handle uploaded image(s)
    portfolio.image_url =
      req.files && req.files.length > 0
        ? `/uploads/${req.files[0].filename}`
        : null;

    console.log("📦 Parsed Portfolio Data:", portfolio);

    // ✅ Validate required fields
    if (!portfolio.title || !portfolio.date_completed) {
      console.warn("⚠️ Missing required fields:", {
        title: portfolio.title,
        date_completed: portfolio.date_completed,
      });
      return res.status(400).json({
        success: false,
        message: "Title and Date Completed are required.",
      });
    }

    // ✅ Insert portfolio record into the database
    console.log("🚀 Inserting portfolio record...");
    const result = await insertPortfolio(portfolio);
    console.log("✅ Database insert result:", result);

    // ✅ Handle database response
    if (result.success) {
      const successResponse = {
        success: true,
        message: result.message || "Portfolio added successfully.",
        insertId: result.insertId,
        data: { id: result.insertId, ...portfolio },
      };

      console.log("🎯 Successful Response:", successResponse);
      return res.status(201).json(successResponse);
    } else {
      const failResponse = {
        success: false,
        message: result.message || "Failed to insert portfolio record.",
      };
      console.error("❌ Database Insert Error:", failResponse);
      return res.status(500).json(failResponse);
    }
  } catch (err) {
    console.error("🔥 Exception in addPortfolioController:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  } finally {
    console.log("📤 addPortfolioController request finished.");
  }
});




// Controller to fetch all portfolio records
const getPortfolioController = async (req, res) => {
  try {
    const result = await getPortfolioData();

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data || [],
    });
  } catch (error) {
    console.error("Error in getPortfolioController:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



module.exports = { getPortfolioController, addPortfolioController };
