const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      required: [true, "Please provide an Email!"],
      unique: [true, "Email Exist"],
    },
    password: {
      required: true,
      type: String,
      required: [true, "Please provide a password!"],
    },
    name: {
      required: true,
      type: String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
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

module.exports = mongoose.model.User || mongoose.model("User", dataSchema);
