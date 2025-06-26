const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const connectionRequestModel = require("../models/requestConnection");
const User = require("../models/user");
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

//Who are my Connections
userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allConnections = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "age",
        "bio",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "gender",
        "skills",
        "age",
        "bio",
      ]);

    const data = allConnections.map((row) =>
      row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    );
    res.json({ message: "List of connections fetched.", data: data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//feed
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const blockUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      blockUserFromFeed.add(req.toUserId.toString());
      blockUserFromFeed.add(req.fromUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(blockUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(["firstName", "lastName", "gender", "skills", "age", "bio"]);

    res.json({ message: "Feed Data", data: user });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
