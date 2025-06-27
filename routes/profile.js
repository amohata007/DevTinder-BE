const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const profileRouter = express.Router();
const { validateProfile } = require("../utils/validate");
const bcrypt = require("bcrypt");
const validator = require("validator");

//Profile Get
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while reading user: " + err.message);
  }
});

//Profile Edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfile(req)) {
      throw new Error("Fields not allowed");
    }
    const user = await req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user.firstName} profile update successfully.`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error while editing user: " + err.message);
  }
});

//Password reset
profileRouter.patch("/profile/reset", userAuth, async (req, res) => {
  try {
    const { password, newPassword } = await req.body;
    const user = await req.user;
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Your current password is not correct..!!");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Please enter strong password..!!");
    }
    if (password === newPassword) {
      throw new Error(
        "Your password should be different from previous one..!!"
      );
    }
    const updatedPassword = await bcrypt.hash(newPassword, 10);
    user.password = updatedPassword;
    user.save();
    res.json({
      message: `${user.firstName}'s password updated successfully..!!`,
    });
  } catch (err) {
    res.status(400).send("Error while reseting password: " + err.message);
  }
});

module.exports = profileRouter;
