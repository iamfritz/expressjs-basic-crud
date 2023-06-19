const express = require("express");
const lib = require("../app/middleware/lib");
const router  = express.Router();
const User = require("../app/models/user");
const authenticator = require("../app/middleware/authenticator");
const auth  = require("../app/middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    if (req.body.password) {
      req.body.password = await bcrypt
        .hash(req.body.password, 10)
        .then((hashedPassword) => {
          return hashedPassword;
        })
        // catch error if the password hash isn't successful
        .catch((e) => {
          response.status(500).send({
            message: "Password was not hashed successfully",
            e,
          });
        });      
      
    }

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

// register endpoint
router.post("/register", (request, response) => {
  // hash the password     
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        name: request.body.name,
        age: request.body.age,
        position: request.body.position,
        level: request.body.level        
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });

});

// login endpoint
router.post("/login", (request, response) => {

  if (!request.body.email || !request.body.password) {
    response.status(401).json({ error: "Email Address and Password is required." });
  }
    // check if email exists
    User.findOne({ email: request.body.email })

      // if email exists
      .then((user) => {
        // compare the password entered and the hashed password found
        bcrypt
          .compare(request.body.password, user.password)

          // if the passwords match
          .then((passwordCheck) => {
            // check if password matches
            if (!passwordCheck) {
              return response.status(401).send({
                message: "Passwords does not match",
                error: "Unauthorized"
              });
            }

            //   create JWT token
            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              "RANDOM-TOKEN",
              { expiresIn: "24h" }
            );

            //   return success response
            response.status(200).send({
              success: true,
              message: "Login Successful",
              email: user.email,
              token,
            });
          })
          // catch error if password does not match
          .catch((error) => {
            response.status(401).send({
              message: "Passwords does not match",
              error: "Unauthorized"
            });
          });
      })
      // catch error if email does not exist
      .catch((e) => {
        response.status(401).send({
          message: "Email not found",
          error: "Unauthorized",
        });
      });
});

router.use((req, res, next) => {
  res.status(400).json({ error: "Request not found" });
});