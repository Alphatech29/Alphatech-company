const { 
  addPage, 
  getPages, 
  deletePage, 
  getPageById, 
  updatePage,
  getPageBySlug
} = require("../../utilities/page");

// Controller to create a new page
const createPageController = async (req, res) => {
  try {
    const { title, slug, description, content } = req.body;

    if (!title || !slug || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, description, and content are required.",
      });
    }

    const newPage = await addPage(title, slug, description, content);

    return res.status(201).json({
      success: true,
      message: newPage.message,
      data: newPage.data,
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the page.",
      error: error.message,
    });
  }
};

// Controller to get all pages
const getPagesController = async (req, res) => {
  try {
    const pages = await getPages();
    if (!pages.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch pages.",
      });
    }

    return res.status(200).json({
      success: true,
      data: pages.data,
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching pages.",
      error: error.message,
    });
  }
};

// Controller to get a page by ID
const getPageByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const page = await getPageById(id);

    if (!page.success || !page.data) {
      return res.status(404).json({
        success: false,
        message: "Page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: page.data,
    });
  } catch (error) {
    console.error("Error fetching page by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the page.",
      error: error.message,
    });
  }
};

// Controller to get a page by SLUG
const getPageBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await getPageBySlug(slug);

    if (!page.success || !page.data) {
      return res.status(404).json({
        success: false,
        message: "Page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: page.data,
    });
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the page by slug.",
      error: error.message,
    });
  }
};

// Controller to update a page by ID
const updatePageController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content } = req.body;

    if (!title || !slug || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, description, and content are required.",
      });
    }

    const updatedPage = await updatePage(id, title, slug, description, content);

    if (!updatedPage.success) {
      return res.status(404).json({
        success: false,
        message: updatedPage.message || "Page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: updatedPage.message,
      data: updatedPage.data,
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the page.",
      error: error.message,
    });
  }
};

// Controller to delete a page
const deletePageController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deletePage(id);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the page.",
      error: error.message,
    });
  }
};

module.exports = {
  createPageController,
  getPagesController,
  getPageByIdController,
  getPageBySlugController,
  updatePageController,
  deletePageController,
};
