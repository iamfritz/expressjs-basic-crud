const User = require("../models/user.model");

const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  try {
    const items = await User.find();

    if (items) {
      let { page, limit } = req.query;

      page = page ? parseInt(page) : 1;
      page = page <= 0 ? 1 : page;
      limit = limit ? parseInt(limit) : 10;
      limit = limit <= 0 ? 1 : limit;

      // calculating the starting and ending index
      let startIndex = (page - 1) * limit;
      let endIndex = page * limit;
      endIndex = endIndex > items.length ? items.length : endIndex;
      let totalPages = Math.ceil(items.length / limit);

      // Check if the start index is out of bounds
      if (startIndex >= items.length) {
        res
          .status(400)
          .json({ status: "error", message: "Page number out of range" });
      }

      let UserList = items.slice(startIndex, endIndex);
      result["status"] = "success";
      result["paging"] = {
        total: items.length,
        pages: totalPages,
        page: page,
        limit: limit,
      };
      result["data"] = UserList;

      res.json(result);
    } else {
      result["status"] = "error";
      result["message"] = `No Record found.`;

      res.status(400).json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
};

//get user
const getUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = await User.findById(req.params.id);
    if (data) {
      result["status"] = "success";
      result["data"] = data;
      res.json(result);
    } else {
      result["status"] = "error";
      result["message"] = `Record not found.`;

      res.status(401).json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
};

//create a new user
const createUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      age: req.body.age,
      position: req.body.position,
      level: req.body.level,
    });

    const newUser = await data.save();
    if (newUser) {
      result["status"] = "success";
      result["data"] = newUser;

      res.json(result);
    } else {
      result["status"] = "error";
      result["message"] = `Unable to add a new record.`;
      res.status(401).json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
};

//update user
const updateUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

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

    const data = await User.findByIdAndUpdate(id, updatedData, options);

    if (data) {
      result["status"] = "success";
      result["message"] = `Record has been updated.`;
      result["data"] = data;

      res.json(result);
    } else {
      result["status"] = "error";
      result["message"] = `Unable to update a record.`;
      res.status(401).json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }

};

//delete user
const deleteUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if (data) {
      result["status"] = "success";
      result["message"] = `Record has been deleted.`;
      res.json(result);
    } else {
      result["status"] = "error";
      result["message"] = `Unable to delete a record.`;
      res.status(401).json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
};

// register endpoint
const registerUser = async (request, response) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };  
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
        level: request.body.level,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((data) => {
          result["status"] = "success";
          result["data"] = data;

          response.json(result);          
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          result["status"] = "error";
          result["message"] = "Error creating user";

          response.status(500).json(result);           
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      result["status"] = "error";
      result["message"] = "Password was not hashed successfully";

      response.status(500).json(result);      
    });
    
};

// login endpoint
const loginUser = async (request, response) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };  
    
  if (!request.body.email || !request.body.password) {
    response
      .status(401)
      .json({ message: "Email Address and Password is required." });
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
              error: "Unauthorized",
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
            error: "Unauthorized",
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
};

module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
};
