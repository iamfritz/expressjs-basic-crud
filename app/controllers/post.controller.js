const Post = require("../models/post.model");
const PostService = require("../services/post.service");
const mongoose = require("mongoose");

const getAllPost = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };

  try {  
    const postItems = await PostService.getManyWithPopulation({}, "category");
    const items = postItems.sort(
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

//get post
const getPost = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = await PostService.getWithPopulation(req.params.id, "category");
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
const createPost = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const { title, description, category } = req.body;
    const categories = category.split(",").map((cat) => cat.trim()); // Split comma-separated categories
    const imageUrl = req.file ? req.file.path : '';
    console.log(imageUrl);

    const data = {
      title: title,
      description: description,
      category: categories,
      image: imageUrl
    };

    const newPost = await PostService.create(data);
    if (newPost) {
      result["status"] = "success";
      result["data"] = newPost;

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
const updatePost = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const options = { new: true };

    const data = await PostService.update(id, updatedData, options);
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
const deletePost = async (req, res) => {
  let result = {
    status: "error",
    message: "",
    data: {},
  };
  try {
    const data = await PostService.delete(req.params.id);
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
  getAllPost,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
