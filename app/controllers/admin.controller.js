const User = require("../models/user.model");

// free endpoint
const freeEndpoint = async (req, res) => {
    res.json({ message: "You are free to access me anytime" });
};

const authEndpoint = async (req, res) => {
    res.json({ message: "You are authorized to access me" });
};

module.exports = {
  freeEndpoint,
  authEndpoint,
};
