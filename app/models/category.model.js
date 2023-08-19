const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      required: [true, "Please provide a name!"],
      unique: [true, "Name already Exist"],
    }
  }
);

module.exports = mongoose.model("Category", dataSchema);
