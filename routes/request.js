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

      //FromUser is in format of Obj("id") so convert with .toString
      if (fromUserId.toString() === toUserId) {
        return res.status(400).json({ message: "Can't send to same person" });
      }

      //Expensive query with large database so better to use index/Compound Index
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

//Receive Connection
requestRouter.post(
  "/request/receive/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      //allow only accepted and rejected
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `${status} is not a valid status..!!` });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: " Connection Request not found..!!" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection ${status} successfully..!!`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
