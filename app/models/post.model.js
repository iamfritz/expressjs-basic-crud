const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
      required: [true, "Please provide an Title!"],
      unique: [true, "Title already Exist"],
    },
    description: {
      required: true,
      type: String,
    },
    category: { type: String },
    tags: { type: String },
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

module.exports = mongoose.model("Post", dataSchema);
