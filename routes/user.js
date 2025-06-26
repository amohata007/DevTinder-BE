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

module.exports = userRouter;
