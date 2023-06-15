const express = require("express");
const app = express.Router();
const authenticator = require("../app/middleware/authenticator");
const auth = require("../app/middleware/auth");

module.exports = app;

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});
