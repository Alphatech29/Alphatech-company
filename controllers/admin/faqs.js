const { getFaqs, addFaq, updateFaq, deleteFaq } = require("../../utilities/faqs");

// Controller to get all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const response = await getFaqs();

    if (!response.success || !response.data.length) {
      return res.status(404).json({
        success: false,
        message: "No FAQs found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQs retrieved successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error in getAllFaqs controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: [],
    });
  }
};

// Controller to add a new FAQ
const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Both question and answer are required",
        data: null,
      });
    }

    const response = await addFaq(question, answer);

    if (!response.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to add FAQ",
        data: null,
      });
    }

    return res.status(201).json({
      success: true,
      message: "FAQ added successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error in createFaq controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Controller to update FAQ by ID
const updateFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Both question and answer are required",
        data: null,
      });
    }

    const response = await updateFaq(id, question, answer);

    if (!response.success) {
      return res.status(404).json({
        success: false,
        message: response.message || "FAQ not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error in updateFaqById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: null,
    });
  }
};

// Controller to delete FAQ by ID
const deleteFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await deleteFaq(id);

    if (!response.success) {
      return res.status(404).json({
        success: false,
        message: response.message || "FAQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteFaqById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllFaqs,
  createFaq,
  updateFaqById,
  deleteFaqById,
};
