const express = require("express");
const lib = require("../app/middleware/lib");
const router = express.Router();
const Post = require("../app/models/post");
const authenticator = require("../app/middleware/authenticator");

module.exports = router;

//sample only
const logStuff = [lib.logOriginalUrl, lib.logMethod];

router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

//Post Method
router.post("/post", async (req, res) => {
  const data = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags    
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/post/all", async (req, res) => {
  try {
    const data = await Post.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/post/:id", async (req, res) => {
  try {
    const data = await Post.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/post/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const options = { new: true };

    const result = await Post.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/post/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Post.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Data with ${data.name} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.use((req, res, next) => {
//   res.status(400).json({ error: "Request not found" });
// });