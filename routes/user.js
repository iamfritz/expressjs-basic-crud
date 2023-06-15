const express = require("express");
const lib = require("../app/middleware/lib");
const router  = express.Router();
const User = require("../app/models/user");
const authenticator = require("../app/middleware/authenticator");

module.exports = router;

//sample only
const logStuff = [lib.logOriginalUrl, lib.logMethod];

router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

//user Method
router.post("", async (req, res) => {
  const data = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    age: req.body.age,
    position: req.body.position,
    level: req.body.level,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/all", async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Data with ${data.name} has been deleted..` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});