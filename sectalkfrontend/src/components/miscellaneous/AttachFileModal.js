import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Box,
    Progress,
    useToast,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from 'react-icons/bs';
import { MdSend } from 'react-icons/md';
import { FaVideo, FaFileAlt } from 'react-icons/fa';
import { useRef, useState } from "react";
import axios from "axios";

const AttachFileModal = ({ user, children, selectedChat, setSelectedChat, messages, setMessages, socket }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(null);
    const imageRef = useRef(null);
    const [video, setVideo] = useState(null);
    const videoRef = useRef(null);
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const toast = useToast();

    const sendImage = async () => {
        if (!image) {
            toast({
                title: "Error Occured!",
                description: "Please select image",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        const formData = new FormData();
        formData.append("image", image);
        formData.append("chatId", JSON.stringify(selectedChat));
        let close = false;

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'content-type': 'multipart/form-data',
            }
        }

        try {
            const { data } = await axios.post(
                "/api/message/send-chat-image",
                formData
                ,
                config
            );

            if (data.success) {
                socket.emit("new message", data.message);
                setMessages([...messages, data.message]);
                toast({
                    title: "Success!",
                    description: "Image sent successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setImage(null);
                close = true;
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
                setImage(null);
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
            setImage(null);
        }


        if (close) {
            onClose();
        }
        imageRef.current.value = null;
    };

    const sendVideo = async (event) => {
        if (!video) {
            toast({
                title: "Error Occured!",
                description: "Please select video",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        const formData = new FormData();
        formData.append("video", video);
        formData.append("chatId", JSON.stringify(selectedChat));
        let close = false;

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'content-type': 'multipart/form-data',
            }
        }

        try {
            const { data } = await axios.post(
                "/api/message/send-chat-video",
                formData
                ,
                config
            );

            if (data.success) {
                socket.emit("new message", data.message);
                setMessages([...messages, data.message]);
                toast({
                    title: "Success!",
                    description: "Video sent successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setVideo(null);
                close = true;
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
                setVideo(null);
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
            setVideo(null);
        }


        if (close) {
            onClose();
        }
        videoRef.current.value = null;
    };

    const sendFile = async (event) => {
        if (!file) {
            toast({
                title: "Error Occured!",
                description: "Please select File",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatId", JSON.stringify(selectedChat));
        let close = false;

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'content-type': 'multipart/form-data',
            }
        }

        try {
            const { data } = await axios.post(
                "/api/message/send-chat-file",
                formData
                ,
                config
            );

            if (data.success) {
                socket.emit("new message", data.message);
                setMessages([...messages, data.message]);
                toast({
                    title: "Success!",
                    description: "File sent successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setFile(null);
                close = true;
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
                setFile(null);
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
            setFile(null);
        }


        if (close) {
            onClose();
        }
        fileRef.current.value = null;
    };


    const onSelectImage = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null)
            return
        }
        setImage(e.target.files[0]);
    }


    const onSelectVideo = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setVideo(null)
            return
        }
        setVideo(e.target.files[0]);
    }


    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(null)
            return
        }
        setFile(e.target.files[0]);
    }

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<AttachmentIcon />}
                    onClick={onOpen}
                />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered closeOnOverlayClick={false}>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Attach File
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="center"
                            p={2}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                        >

                            <div
                                style={{
                                    margin: 5,
                                    padding: 5,
                                }}
                            >
                                <Progress hasStripe colorScheme='green' size='sm' value={69} />
                            </div>

                            <Box
                                w="100%"
                                fontFamily="Work sans"
                                display="flex"
                                justifyContent={{ base: "center" }}
                                alignItems="center"
                            >
                                <BsFillImageFill
                                    size={20}
                                />
                                <input
                                    type="file"
                                    style={{
                                        margin: 5,
                                    }}
                                    onChange={(e) => onSelectImage(e)}
                                    ref={imageRef}
                                />
                                <MdSend
                                    size={25}
                                    className="attach-file-send-icons"
                                    onClick={sendImage}
                                />
                            </Box>

                            <Box
                                w="100%"
                                fontFamily="Work sans"
                                display="flex"
                                justifyContent={{ base: "center" }}
                                alignItems="center"
                            >
                                <FaVideo
                                    size={20}
                                />
                                <input
                                    type="file"
                                    style={{
                                        margin: 5,
                                    }}
                                    onChange={(e) => onSelectVideo(e)}
                                    ref={videoRef}
                                />
                                <MdSend
                                    size={25}
                                    className="attach-file-send-icons"
                                    onClick={sendVideo}
                                />
                            </Box>
                            <Box
                                w="100%"
                                fontFamily="Work sans"
                                display="flex"
                                justifyContent={{ base: "center" }}
                                alignItems="center"
                            >
                                <FaFileAlt
                                    size={20}
                                />
                                <input
                                    type="file"
                                    style={{
                                        margin: 5,
                                    }}
                                    onChange={(e) => onSelectFile(e)}
                                    ref={fileRef}
                                />
                                <MdSend
                                    size={25}
                                    className="attach-file-send-icons"
                                    onClick={sendFile}
                                />
                            </Box>

                        </Box>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AttachFileModal;
