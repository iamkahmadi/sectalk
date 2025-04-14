const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isNormalMessage: {
      type: Boolean,
      default: false,
    },
    isImage: {
      type: Boolean,
      default: false,
    },
    isVideo: {
      type: Boolean,
      default: false,
    },
    isFile: {
      type: Boolean,
      default: false,
    },
    isAudio: {
      type: Boolean,
      default: false,
    },
    imagePath: {
      type: "String",
      required: false,
      default: "",
    },
    videoPath: {
      type: "String",
      required: false,
      default: "",
    },
    filePath: {
      type: "String",
      required: false,
      default: "",
    },
    audioPath: {
      type: "String",
      required: false,
      default: "",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
