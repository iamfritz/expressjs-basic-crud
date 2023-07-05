const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    api_key: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

dataSchema.pre("save", function (next) {
  now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model("Apikey", dataSchema);
