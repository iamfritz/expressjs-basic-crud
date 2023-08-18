const express = require("express");
const lib = require("../util/lib");
const router  = express.Router();
const authenticatorKey = require("../middleware/authKey");
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

router
  .route("/")
  .get(authenticator, getAllUser)
  .post(authenticator, createUser);

//get log user
router.get("/info", authenticator, userInfo);

//register and login
router.post("/register", authenticatorKey, registerUser);
router.post("/login", authenticatorKey, loginUser);

router
  .route("/:id")
  .get(authenticator, getUser)
  .delete(authenticator, deleteUser)
  .put(authenticator, updateUser);

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});


/* router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
}); */

//get all user
//router.get("/", authenticator, getAllUser);

//post a new user
//router.post("/", authenticator, createUser);

//get user
//router.get("/:id", authenticator, getUser);

//update user
//router.patch("/:id", authenticator, updateUser);

//delete user
//router.delete("/:id", authenticator, deleteUser);