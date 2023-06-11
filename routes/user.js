const express = require("express");
const lib     = require("../middleware/lib");
const router  = express.Router();
const User    = require("../models/user");
const authenticator = require("../middleware/authenticator");

module.exports = router;

//sample only
const logStuff = [lib.logOriginalUrl, lib.logMethod];

router.use(authenticator, (req, res, next) => {
  console.log("Time:", Date.now());
  //if (!req.headers["api-key"]) res.sendStatus(401);

  next();
});
//Post Method
router.post("/user", async (req, res) => {
  const data = new User({
    name: req.body.name,
    age: req.body.age,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/user/all", async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/user/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/user/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    console.log(req);
    console.log(id);
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/user/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
