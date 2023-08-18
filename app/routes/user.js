const express = require("express");
const lib = require("../util/lib");
const router  = express.Router();
//const authenticator = require("../middleware/authKey");
const authenticator = require("../middleware/authJWT");

module.exports = router;

const {
  getAllUser,
  getUser,
  userInfo,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
} = require("../controllers/user.controller");

/* router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
}); */

//get all user
router.get("/info", authenticator, userInfo);

//get all user
router.get("/", getAllUser);

//post a new user
router.post("/", createUser );

//get user
router.get("/:id", getUser);

//update user
router.patch("/:id", updateUser );

//delete user
router.delete("/:id", deleteUser);

//register and login
router.post("/register", registerUser);
router.post("/login", loginUser);

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});