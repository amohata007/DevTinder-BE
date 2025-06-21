const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const profileRouter = express.Router();

//Profile Get
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "user");
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while reading user: " + err.message);
  }
});

module.exports = profileRouter;
