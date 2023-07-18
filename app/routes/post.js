const express = require("express");
const router = express.Router();
const lib = require("../util/lib");
const authenticator = require("../middleware/authenticator");

module.exports = router;

const {
  getAllPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

//sample only
const logStuff = [lib.logOriginalUrl, lib.logMethod];

router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

//Post Method
router.post("/post", createPost);

//Get all Method
router.get("/post/all", getAllPost);

//Get by ID Method
router.get("/post/:id", getPost);

//Update by ID Method
router.patch("/post/update/:id", updatePost);

//Delete by ID Method
router.delete("/post/delete/:id", deletePost);

/* 
router
  .route("/")
  .get(todoController.getTodos)
  .post(todoController.addTodo)
  .put(todoController.updateTodo); */
