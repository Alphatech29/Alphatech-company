const express = require("express");
const { getPortfolioController, addPortfolioController } = require("../controllers/admin/portfolio");
const { fetchWebsiteSettings, updateWebsiteSettingsController, addWebsiteAvatarController } = require("../controllers/admin/websiteSettings");
const { createTestimony, fetchTestimonies, removeTestimonyById } = require("../controllers/admin/testimonies");
const { getAllFaqs, createFaq, updateFaqById, deleteFaqById } = require("../controllers/admin/faqs");
const { createContactForm, fetchAllContactForms, removeContactForm } = require("../controllers/admin/adminContact");
const { createAdminContactForm } = require("../controllers/admin/contact");
const { createPageController, getPagesController, updatePageController, getPageByIdController, getPageBySlugController } = require("../controllers/admin/page");
const { createConsultationBooking, verifyConsultationTransaction, fetchAllConsultationBookings, consultationPrepared, updateConsultationBooking } = require("../controllers/admin/consultation");
const { paystackWebhook } = require("../utilities/paystackWebhook");
const { createBlog, getBlogController, deleteBlogController, updateBlogController, getBlogBySlugController, addBlogCommentController, getCommentsByBlogIdController } = require("../controllers/admin/bolg");
const generalRoute = express.Router();


// ------- General --------- //
generalRoute.get("/portfolio",getPortfolioController);
generalRoute.post("/add-portfolio",addPortfolioController);
generalRoute.get("/websettings",fetchWebsiteSettings);
generalRoute.put("/update-field",updateWebsiteSettingsController);
generalRoute.put("/settings-profile",addWebsiteAvatarController);
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
generalRoute.post("/create-page" ,createPageController)
generalRoute.put("/page-edit/:id" ,updatePageController)
generalRoute.get("/get-page/:id" ,getPageByIdController)
generalRoute.get("/get-page" ,getPagesController)
generalRoute.get("/page/:slug" ,getPageBySlugController)
generalRoute.post("/consultation" ,createConsultationBooking)
generalRoute.post("/consultation-prepard" ,consultationPrepared)
generalRoute.put("/consultation-reschedule" ,updateConsultationBooking)
generalRoute.post("/createBlog" ,createBlog)
generalRoute.get("/getBlog" ,getBlogController)
generalRoute.post("/addcomment" ,addBlogCommentController)
generalRoute.get("/getcomment/:blog_id" ,getCommentsByBlogIdController)
generalRoute.put("/updateBlog/:id" ,updateBlogController)
generalRoute.get("/getslug/:slug" ,getBlogBySlugController)
generalRoute.delete("/deleteBlog/:id" ,deleteBlogController)
generalRoute.get("/get-consultation" ,fetchAllConsultationBookings)
generalRoute.post("/webhook",paystackWebhook);
generalRoute.get("/verify-transaction",verifyConsultationTransaction);


module.exports = generalRoute;
