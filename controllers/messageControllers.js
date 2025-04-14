const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const multer = require("multer");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    isNormalMessage: true,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});




// multer code for user uploading image
var ImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/chatImages/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.toLowerCase())
  }
})

const imageFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    req.invalidData = false;
    cb(null, true)
  }
  else {
    req.invalidData = true;
    cb(null, false)
  }
}

const imageUpload = multer({
  storage: ImageStorage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: imageFilter
})



const sendMessageImage = async (req, res) => {
  var { chatId } = req.body;
  chatId = JSON.parse(chatId);


  if (!chatId || req.invalidData) {
    res.json({ success: false, message: "Invalid data passed into request" });
    return;
  }

  // console.log(req.file);
  // res.json({ success: false, message: "Invalid data passed into request" });

  let imagePath = req.file.path;

  var newMessage = {
    sender: req.user._id,
    content: "Sent Image",
    isImage: true,
    imagePath: imagePath,
    chat: chatId,
  };


  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId._id, { latestMessage: message });

    res.json({ success: true, message: message, });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to send image" });
  }

}






// multer code for user uploading video
var videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/chatVideos/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.toLowerCase())
  }
})

const videoFilter = (req, file, cb) => {
  if (
    file.mimetype === "video/mp4"
    || file.mimetype === "video/avi"
    || file.mimetype === "video/mkv"
  ) {
    req.invalidData = false;
    cb(null, true)
  }
  else {
    req.invalidData = true;
    cb(null, false)
  }
}

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 5
  },
  fileFilter: videoFilter
})





const sendMessageVideo = async (req, res) => {
  var { chatId } = req.body;
  chatId = JSON.parse(chatId);


  if (!chatId || req.invalidData) {
    res.json({ success: false, message: "Invalid data passed into request" });
    return;
  }

  let videoPath = req.file.path;

  var newMessage = {
    sender: req.user._id,
    content: "Sent Video",
    isVideo: true,
    videoPath: videoPath,
    chat: chatId,
  };


  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId._id, { latestMessage: message });

    res.json({ success: true, message: message, });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to send image" });
  }

}


// multer code for user uploading file
var fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/chatFiles/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.toLowerCase())
  }
})

const fileFilter = (req, file, cb) => {
  if (true) {
    req.invalidData = false;
    cb(null, true)
  }
  else {
    req.invalidData = true;
    cb(null, false)
  }
}

const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})





const sendMessageFile = async (req, res) => {
  var { chatId } = req.body;
  chatId = JSON.parse(chatId);

  if (!chatId || req.invalidData) {
    res.json({ success: false, message: "Invalid data passed into request" });
    return;
  }

  let filePath = req.file.path;

  var newMessage = {
    sender: req.user._id,
    content: "Sent File",
    isFile: true,
    filePath: filePath,
    chat: chatId,
  };


  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId._id, { latestMessage: message });

    res.json({ success: true, message: message, });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to send image" });
  }

}





// multer code for user uploading voice message
var voiceMessageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/chatVoiceMessages/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.toLowerCase())
  }
})

const voiceMessageFilter = (req, file, cb) => {
  if (true) {
    req.invalidData = false;
    cb(null, true)
  }
  else {
    req.invalidData = true;
    cb(null, false)
  }
}

const voiceMessageUpload = multer({
  storage: voiceMessageStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024 * 5
  },
  fileFilter: voiceMessageFilter
})



const sendVoiceMessage = async (req, res) => {
  var { chatId } = req.body;
  chatId = JSON.parse(chatId);

  if (!chatId || req.invalidData) {
    res.json({ success: false, message: "Invalid data passed into request" });
    return;
  }

  let filePath = req.file.path;

  var newMessage = {
    sender: req.user._id,
    content: "Sent Audio",
    isAudio: true,
    audioPath: filePath,
    chat: chatId,
  };


  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId._id, { latestMessage: message });

    res.json({ success: true, message: message, });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "failed to send image" });
  }

}





module.exports = { allMessages, sendMessage, imageUpload, sendMessageImage, videoUpload, sendMessageVideo, fileUpload, sendMessageFile, voiceMessageUpload, sendVoiceMessage };
