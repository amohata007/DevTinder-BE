const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const requestRouter = express.Router();

// Send Connection
requestRouter.post("/sendConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sent Connection Successfully!!");
    res.send("Connection Sent by " + user.firstName);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;
