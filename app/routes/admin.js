const express = require("express");
const lib = require("../middleware/lib");
const router = express.Router();
const authenticator = require("../middleware/authenticator");

module.exports = router;

const {
  freeEndpoint,
  authEndpoint
} = require("../controllers/user.controller");

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", (request, response) => {
  response.json({ message: "You are authorized to access me" });
});