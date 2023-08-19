const express = require("express");
const router = express.Router();
const lib = require("../util/lib");
const authenticator = require("../middleware/authJWT");

module.exports = router;

const {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

/* group method */
router
  .route("/")
  .get(authenticator, getAllCategory)
  .post(authenticator, createCategory);

router
  .route("/:id")
  .get(authenticator, getCategory)
  .delete(authenticator, deleteCategory)
  .put(authenticator, updateCategory);
