const express = require("express");
const { userAuth } = require("../Middlewares/admin");
const connectionRequestModel = require("../models/requestConnection");
const User = require("../models/user");
const requestRouter = express.Router();

// Send Connection
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ message: "Can't send to same person" });
      }

      const toUserIdExist = await User.findOne({ _id: toUserId });
      if (!toUserIdExist) {
        return res.status(400).json({ message: "Invalid UserId" });
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status.. " + status });
      }

      //if there is an existing connection
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({ message: "Connection Already Sent " });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `Connection request - ${status}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
