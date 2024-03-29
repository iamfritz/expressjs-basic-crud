const express = require("express");
const router = express.Router();
const lib = require("../util/lib");
const authenticator = require("../middleware/authJWT");

const multer = require('multer');
const path = require('path');

module.exports = router;

const {
  getAllPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/* group method */
router
  .route("/")
  .get(authenticator, getAllPost)
  //.post(authenticator, createPost);
  .post(authenticator, upload.single('image'), createPost);

router
  .route("/:id")
  .get(authenticator, getPost)
  .delete(authenticator, deletePost)
  .put(authenticator, updatePost);

//sample only
//const logStuff = [lib.logOriginalUrl, lib.logMethod];

/* router.use(authenticator, (req, res, next) => {
  console.log("User Routes - Time:", Date.now());
  next();
}); */

//Post Method
//router.post("/", createPost);

//Get all Method
//router.get("/", getAllPost);

//Get by ID Method
//router.get("/:id", getPost);

//Update by ID Method
//router.patch("/:id", updatePost);

//Delete by ID Method
//router.delete("/:id", deletePost);
