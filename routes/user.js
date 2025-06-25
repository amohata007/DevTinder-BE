const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const connectionRequestModel = require("../models/requestConnection");
const userRouter = express.Router();

//Request Received APIs
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receivedConnection = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "age",
        "bio",
      ]);
    res.json({
      message: "Fetched Data Successfully",
      data: receivedConnection,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
