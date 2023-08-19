const Category = require("../models/category.model");

const getAllCategory = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  try {
    const items = await Category.find();

    if (items.length === 0) {    
      result["status"] = "error";
      result["message"] = `No Record found.`;

      res.status(400).json(result);
    } else {
    
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

      let postItems = items.slice(startIndex, endIndex);
      result["status"] = "success";
      result["paging"] = {
        total: items.length,
        pages: totalPages,
        page: page,
        limit: limit,
      };
      result["data"] = postItems;

      res.json(result);
    }
  } catch (error) {
    result["status"] = "error";
    result["message"] = error.message;

    res.status(500).json(result);
  }
};

//get post
const getCategory = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  
  try {
    const data = await Category.findById(req.params.id);
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

//create a new post
const createCategory = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {    
    const { name } = req.body;
    const data = new Category({
      name: name
    });

    const newCategory = await data.save();
    if (newCategory) {
      result["status"] = "success";
      result["data"] = newCategory;

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

//update post
const updateCategory = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {

    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const data = await Category.findByIdAndUpdate(id, updatedData, options);
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

//delete post
const deleteCategory = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = await Category.findByIdAndDelete(req.params.id);
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

module.exports = {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
