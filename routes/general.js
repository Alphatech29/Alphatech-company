const express = require("express");
const { getPortfolioController, addPortfolioController } = require("../controllers/admin/portfolio");
const { fetchWebsiteSettings, updateWebsiteSettingsController } = require("../controllers/admin/websiteSettings");
const { createTestimony, fetchTestimonies, removeTestimonyById } = require("../controllers/admin/testimonies");
const generalRoute = express.Router();


// ------- General --------- //
generalRoute.get("/portfolio",getPortfolioController);
generalRoute.post("/add-portfolio",addPortfolioController);
generalRoute.get("/websettings",fetchWebsiteSettings);
generalRoute.put("/update-field",updateWebsiteSettingsController);
generalRoute.post("/createTestimony" ,createTestimony);
generalRoute.get("/get-testimony" ,fetchTestimonies);
generalRoute.delete("/delete-testimony/:id" ,removeTestimonyById);


module.exports = generalRoute;
