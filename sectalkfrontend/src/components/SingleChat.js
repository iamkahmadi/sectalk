import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { AiFillAudio, AiFillPlayCircle, AiOutlineSend, AiFillDelete } from 'react-icons/ai';
import { Icon } from '@chakra-ui/react'



import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import AttachFileModal from "./miscellaneous/AttachFileModal";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  // audio state variables
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  // audio state variables end here



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };







  // audio state functions start here
  const startRecording = () => {
    if (mediaRecorderRef.current || recording) return;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.addEventListener('dataavailable', (event) => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          setRecordedBlob(blob);
          chunks.length = 0;
        });

        mediaRecorder.addEventListener('start', () => {
          const intervalId = setInterval(() => {
            setDuration((prevDuration) => prevDuration + 1000);
          }, 1000);

          mediaRecorder.addEventListener('stop', () => {
            clearInterval(intervalId);
          });
        });


        mediaRecorder.start();
        setRecording(true);
        mediaRecorderRef.current = mediaRecorder;

      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !recording) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    mediaRecorderRef.current = null;
  };

  const playRecording = () => {
    if (audioRef.current && recordedBlob) {
      const audioURL = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioURL;
      audioRef.current.play();
    }
  };

  const sendRecording = async () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'chat_voice_message.mp3', {
        type: recordedBlob.type
      });

      // const formData = new FormData();
      // formData.append('voiceMessage', recordedBlob);
      // formData.append("chatId", JSON.stringify(selectedChat));
      const formData = new FormData();
      formData.append('voiceMessage', file);
      formData.append("chatId", JSON.stringify(selectedChat));

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'content-type': 'multipart/form-data',
        }
      }


      try {
        const { data } = await axios.post(
          "/api/message/send-chat-voice-msg",
          formData
          ,
          config
        );

        if (data.success) {
          socket.emit("new message", data.message);
          setMessages([...messages, data.message]);
          toast({
            title: "Success!",
            description: "voice message sent successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          discardRecording();
        }
        else {
          toast({
            title: "Error Occured!",
            description: data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

    }
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setRecording(false);
    setRecordedBlob(null);
    setDuration(0);
  };

  useEffect(() => {
    if (recording && audioRef.current) {
      const audioElement = audioRef.current;
      audioElement.addEventListener('timeupdate', updateTime);

      return () => {
        audioElement.removeEventListener('timeupdate', updateTime);
      };
    }
  }, [recording]);

  const updateTime = () => {
    setDuration(audioRef.current.currentTime);
  };

  // audio state functions end here




  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}

              <Box
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
              >

                {recordedBlob ? (
                  <div
                    className="recorded-message"
                    style={{
                      width: "90%"
                    }}
                  >
                    <audio ref={audioRef} controls />
                    <div className="message-controls">
                      <AiFillPlayCircle
                        size={25}
                        className="button"
                        onClick={playRecording}
                      />
                      <AiOutlineSend
                        size={25}
                        className="button"
                        onClick={sendRecording}
                      />
                      <AiFillDelete
                        size={25}
                        className="button"
                        onClick={discardRecording}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Input
                      variant="filled"
                      bg="#E0E0E0"
                      placeholder="Enter a message.."
                      value={newMessage}
                      onChange={typingHandler}
                      width={'90%'}
                    />
                  </>
                )}


                <>
                  <AttachFileModal
                    user={user}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    messages={messages}
                    setMessages={setMessages}
                    socket={socket}
                  />
                </>



                {recording ? (
                  <span
                    className="recording-button"
                    onClick={stopRecording}
                  >
                    <AiFillAudio
                      size={30}
                      style={{
                        background: "white",
                        color: "black",
                        borderRadius: "8px",
                        cursor: "pointer",
                        padding: "5px"
                      }}
                    />
                    {recording &&
                      <b
                        style={{
                          fontSize: "10px"
                        }}
                      >{duration / 1000}:s</b>
                    }
                  </span>
                ) : (
                  <>
                    <AiFillAudio
                      size={40}
                      style={{
                        background: "white",
                        color: "black",
                        borderRadius: "8px",
                        cursor: "pointer",
                        padding: "5px"
                      }}

                      onClick={startRecording}
                    />
                  </>
                )
                }

              </Box>

            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
