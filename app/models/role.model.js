const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    required: [true, "Please provide a Role Name!"],
    unique: [true, "Role Name already exist"],
  },
});

module.exports = mongoose.model("Role", roleSchema);
