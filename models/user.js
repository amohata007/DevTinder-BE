const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 4,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email..!!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong Password..!!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        console.log(value);
        if (value !== "male" && value !== "female") {
          throw new Error("Invalid Gender");
        }
      },
    },
    skills: {
      type: [String],
    },
    bio: {
      type: String,
      default: "Hey Welcome",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// Mongoose automatically:
// Takes "User" → converts to lowercase → user
// Pluralizes it → users
// Connects it to the users collection inside your connected database (devtinder)

module.exports = User;
