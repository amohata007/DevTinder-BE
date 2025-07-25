const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  requestSchema
);

module.exports = connectionRequestModel;
