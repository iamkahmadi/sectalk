import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { FaFileAlt } from 'react-icons/fa';
import { Box } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.isNormalMessage && (
                m.content
              )}
              {m.isImage && (
                <img src={`http://localhost:5000/${m.imagePath}`} alt="user sent chat img" width={300} height={200} />
              )}
              {m.isVideo && (
                <video controls width={300} height={200}>
                  <source src={`http://localhost:5000/${m.videoPath}`} />
                </video>
              )}
              {m.isFile && (
                <>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <FaFileAlt
                      size={20}
                    />
                    <a href={`http://localhost:5000/${m.filePath}`} download target="_blank">{m.filePath.split("\\").pop()}</a>
                  </Box>
                </>
              )}

              {m.isAudio && (
                <audio controls src={`http://localhost:5000/${m.audioPath}`}></audio>
              )}

            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
