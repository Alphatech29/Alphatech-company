const express = require("express");
const { login} = require("../controllers/auths/login");
const authRoute = express.Router();


// ------- Authentication --------- //
authRoute.post("/login",login);


module.exports = authRoute;
