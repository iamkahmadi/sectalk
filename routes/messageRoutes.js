const express = require("express");
const {
  allMessages,
  sendMessage,
  sendMessageImage,
  imageUpload,
  videoUpload,
  sendMessageVideo,
  sendMessageFile,
  fileUpload,
  voiceMessageUpload,
  sendVoiceMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

router.post("/send-chat-image", protect, imageUpload.single("image"), sendMessageImage);
router.post("/send-chat-video", protect, videoUpload.single("video"), sendMessageVideo);
router.post("/send-chat-file", protect, fileUpload.single("file"), sendMessageFile);
router.post("/send-chat-voice-msg", protect, voiceMessageUpload.single("voiceMessage"), sendVoiceMessage);

module.exports = router;