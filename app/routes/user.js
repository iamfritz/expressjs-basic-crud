const express = require("express");
const lib = require("../middleware/lib");
const router  = express.Router();
const authenticator = require("../middleware/authenticator");

module.exports = router;

const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
} = require("../controllers/user.controller");

router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

//get all user
router.get("/", getAllUser);

//post a new user
router.post("/", createUser );

//get user
router.get("/:id", getUser);

//update user
router.patch("/update/:id", updateUser );

//delete user
router.delete("/delete/:id", deleteUser);

//register and login
router.post("/register", registerUser);
router.post("/login", loginUser);

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});