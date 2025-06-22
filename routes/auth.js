const express = require("express");
const { validateFunction } = require("../utils/validate");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//signup APi
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate data at first instance
    validateFunction(req);

    //Hashing of the password
    const { firstName, lastName, emailId, password, age, gender, skills, bio } =
      req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(409).send("Email already registered");
    }

    //creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
      bio,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving user: " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        //expires Token
        //can also expires Cookie - expires keyword
        const token = await jwt.sign({ _id: user._id }, "Namaste@123", {
          expiresIn: "7d",
        });
        res.cookie("token", token);
        res.send("Login Successfull");
      } else {
        throw new Error("Invalid Credentials");
      }
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Problem while Login in: " + err.message);
  }
});

//logout api
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfully");
});

//

module.exports = authRouter;
