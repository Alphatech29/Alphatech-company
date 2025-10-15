const express = require("express");
const { getPortfolioController, addPortfolioController } = require("../controllers/admin/portfolio");
const { fetchWebsiteSettings, updateWebsiteSettingsController } = require("../controllers/admin/websiteSettings");
const { createTestimony, fetchTestimonies, removeTestimonyById } = require("../controllers/admin/testimonies");
const { getAllFaqs, createFaq, updateFaqById, deleteFaqById } = require("../controllers/admin/faqs");
const { createContactForm, fetchAllContactForms, removeContactForm } = require("../controllers/admin/adminContact");
const { createAdminContactForm } = require("../controllers/admin/contact");
const generalRoute = express.Router();


// ------- General --------- //
generalRoute.get("/portfolio",getPortfolioController);
generalRoute.post("/add-portfolio",addPortfolioController);
generalRoute.get("/websettings",fetchWebsiteSettings);
generalRoute.put("/update-field",updateWebsiteSettingsController);
generalRoute.post("/createTestimony" ,createTestimony);
generalRoute.get("/get-testimony" ,fetchTestimonies);
generalRoute.delete("/delete-testimony/:id" ,removeTestimonyById);
generalRoute.get("/get-faqs" ,getAllFaqs);
generalRoute.post("/add-faqs" ,createFaq);
generalRoute.put("/update-faqs/:id" ,updateFaqById);
generalRoute.delete("/delete-faq/:id" ,deleteFaqById);
generalRoute.post("/send-message" ,createContactForm);
generalRoute.get("/contact" ,fetchAllContactForms);
generalRoute.delete("/remove/:id" ,removeContactForm);
generalRoute.post("/create-contact" ,createAdminContactForm);


module.exports = generalRoute;
