const User = require("../models/user.model");
const Role = require("../models/role.model");

const auth = require("../middleware/authJWT");
const bcrypt = require("bcrypt");
const saltRounds = 10; // Number of salt rounds, higher is more secure but slower
const jwt = require("jsonwebtoken");

// Function to hash a password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

const getAllUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  try {
    const userItems = await User.find().populate("roles");
    const items = userItems.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
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

      let users = items.slice(startIndex, endIndex);
      result["status"] = "success";
      result["paging"] = {
        total: items.length,
        pages: totalPages,
        page: page,
        limit: limit,
      };
      const sanitizedUsers = users.map(sanitizeUser);    

      result["data"] = sanitizedUsers;

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
  
  /* const isAdmin = req.user.roles.some((role) => role.name === "admin");
  if (!isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  } */  
  try {
    const data = await User.findById(req.params.id).populate("roles");
    if (data) {
      const sanitizedUser = sanitizeUser(data);
      result["status"] = "success";
      result["data"] = sanitizedUser;
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

  const { email, password, name, roles } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    // Find roles by name
    const foundRoles = await Role.find({ name: { $in: roles } });

    // Create the user and associate roles
    const user = new User({
      email,
      name,
      password : hashedPassword, // Remember to hash the password before saving it
      roles: foundRoles.map((role) => role._id),
    });

    // save the new user
    user.save()
      // return success if the new user is added to the database successfully
      .then((data) => {
        result["status"] = "success";
        result["data"] = data;

        res.json(result);
      })
      // catch error if the new user wasn't added successfully to the database
      .catch((error) => {
        console.error(error);
        result["status"] = "error";
        result["message"] = "Error creating user";

        res.status(500).json(result);
      });
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

  const id = req.params.id;
  const { email, password, name, roles } = req.body;

  const hashedPassword = await hashPassword(password);

  try {
    // Find roles by name
    const foundRoles = await Role.find({ name: { $in: roles } });

    let dataUpdate = {
      email,
      name,
      roles: foundRoles.map((role) => role._id),
    };
    if(password) {
      dataUpdate['password'] = hashedPassword; // Remember to hash the password before saving it
    }

    const options = { new: true };
    const data = await User.findByIdAndUpdate(id, dataUpdate, options);

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
const registerUser = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  const { email, password, name } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    // Find roles by name
    const foundRoles = await Role.find({ name: { $in: ["user"] } });

    // Create the user and associate roles
    const user = new User({
      email,
      name,
      password: hashedPassword, // Remember to hash the password before saving it
      roles: foundRoles.map((role) => role._id),
    });

    // save the new user
    user
      .save()
      // return success if the new user is added to the database successfully
      .then((data) => {
        result["status"] = "success";
        result["data"] = data;

        res.json(result);
      })
      // catch error if the new user wasn't added successfully to the database
      .catch((error) => {
        console.error(error);
        result["status"] = "error";
        result["message"] = "Error creating user";

        res.status(500).json(result);
      });
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
    
};

// login endpoint
const loginUser = async (request, response) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };  
    
  if (!request.body.email || !request.body.password) {
    result["message"] = "Email Address and Password is required.";

    response.status(401).json(result);
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
            result["message"] = "Passwords does not match";

            response.status(401).json(result);
          }

          const JWT_SECRET = process.env.JWT_SECRET || "SECRET-TOKEN";
          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            JWT_SECRET,
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            status: "success",
            message: "Login Successful",
            data: {
              email: user.email,
              token
            }
          });
        })
        // catch error if password does not match
        .catch((error) => {
          result["message"] = "Passwords does not match";

          response.status(401).json(result);
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      result["message"] = "Email Address not found.";

      response.status(401).json(result);
    });
};

const userInfo = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  try {
    const userId = req.user.userId;
    const data = await User.findById(userId);
    if (data) {
      /* const sanitizedUser = sanitizeUser(data); */
      result["status"] = "success";
      result["data"] = req.user;
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

function sanitizeUser(user) {
    const { _id, email, name, roles } = user;
    return { _id, email, name, roles };  
}
module.exports = {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  userInfo,
};
