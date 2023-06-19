import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Configuration, OpenAIApi } from "openai";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../config/firebase";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import localDalleImage from "../assets/downloaded-image.jpg";

const GenieChat = ({
  toggleGenieChat,
  isGenieChatOpen,
  setHoodieImage,
  hoodieImage,
  ...props
}) => {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  const [typing, setTyping] = useState(false);
  const [dalleImage, setDalleImage] = useState("");
  const [messages, setMessages] = useState([
    {
      message:
        "Welcome, I am the genie — here to grant your design wishes. Let's start with choosing a medium of design. For example, would you like a photograph, painting, 3D render, or drawing?",
      sender: "ChatGPT",
    },
  ]);
  const [stage, setStage] = useState("chooseMedium");
  const [selectedArtStyle, setSelectedArtStyle] = useState("");
  const [selectVisible, setSelectVisible] = useState(false);
  const [dallePrompt, setDallePrompt] = useState([]);
  const [dalleProptString, setDallePromptString] = useState("");

  const configuration = useMemo(() => new Configuration({ apiKey }), [apiKey]);

  console.log(apiKey);

  const openai = useMemo(() => new OpenAIApi(configuration), [configuration]);

  const generateImage = useCallback(async () => {
    console.log("generating image");
    const res = await openai.createImage({
      prompt: dalleProptString,
      n: 1,
      size: "1024x1024",
    });

    console.log(res.data.data[0].url);
    setDalleImage(res.data.data[0].url);
  }, [dalleProptString, openai]);

  const handleDownloadImage = async () => {
    try {
      await saveImageToProxyServer(dalleImage);
      const response = await axios.get(dalleImage, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Image downloaded successfully");
      // Handle the success of the image download and post if needed
    } catch (error) {
      console.error("Error while downloading the image:", error);
      // Handle the error
    }
  };

  const saveImageToProxyServer = async (imageData) => {
    try {
      console.log("saving to proxy server");
      console.log(imageData);
      await axios.options(
        "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/server"
      );
      // Make a POST request to your proxy server endpoint to save the image
      await axios.post(
        "https://mellifluous-cendol-c1b874.netlify.app/.netlify/functions/server",
        imageData,
        {
          headers: {
            "Content-Type": "image/jpeg",
          },
        }
      );

      console.log("Image saved to proxy server successfully");

      // Handle the success of saving the image to the proxy server
    } catch (error) {
      console.error("Error while saving the image to the proxy server:", error);
      // Handle the error
    }
  };

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await processMessageToChatGPT(newMessages, stage);

    const updatedDallePrompt = [...dallePrompt, newMessage.message];
    setDallePrompt(updatedDallePrompt);

    console.log(dallePrompt);
    setDallePromptString(
      `a ${dallePrompt[0]} in the ${dallePrompt[1]} style of ${dallePrompt[2]} ${dallePrompt[3]}`
    );
  };

  // const convertDallePromptToString = () => {
  //   setDallePrompt(dallePrompt.join(" "));
  // };

  // useEffect(() => {
  //   console.log(dalleProptString);
  //   // setDallePrompt(dallePrompt.join(" "));
  // });

  useEffect(() => {
    if (stage === "dalleOutput" && !dallePrompt.includes("undefined")) {
      generateImage();
    }
  }, [stage, dallePrompt, generateImage]);

  async function processMessageToChatGPT(chatMessages, currentStage) {
    // const userMessage = chatMessages[chatMessages.length - 1].message;

    // Define prompts and stages
    const promptByStage = {
      chooseMedium:
        "What kind of art style do you want? For example, impressionist, cubism, etc.",
      chooseStyle: "What is the subject matter you would like in the design?",
      chooseSubject: "What is the context of your subject, where is it? etc...",
      grantingWish: "Okay! I will now grant your wish!",
      dalleOutput: dalleImage,
      // Add more stages and prompts as needed
    };

    const prompt = promptByStage[currentStage];

    const systemMessage = {
      role: "system",
      content:
        "You are a Genie with expertise in fashion, design, and art history.",
    };

    const apiMessages = [
      systemMessage,
      ...chatMessages.map((messageObject) => ({
        role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
        content: messageObject.message,
      })),
    ];

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: apiMessages,
    };

    if (currentStage === "chooseMedium" && apiMessages.length === 3) {
      apiRequestBody.messages.splice(2, 0, {
        role: "system",
        content: prompt,
      });
    } else if (currentStage === "chooseStyle" && apiMessages.length === 4) {
      apiRequestBody.messages.splice(3, 0, {
        role: "system",
        content: prompt,
      });
    } else if (currentStage === "chooseSubject" && apiMessages.length === 5) {
      apiRequestBody.messages.splice(4, 0, {
        role: "system",
        content: prompt,
      });
    } else if (currentStage === "grantingWish" && apiMessages.length === 6) {
      apiRequestBody.messages.splice(5, 0, {
        role: "system",
        content: prompt,
      });
    } else if (currentStage === "dalleOutput" && apiMessages.length === 7) {
      apiRequestBody.messages.splice(6, 0, {
        role: "system",
        content: prompt,
      });
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const response = prompt;
        setTyping(false);
        setStage(getNextStage(currentStage));
        handleMessageResponse(response);
      })
      .catch((error) => {
        console.error("Error:", error);
        setTyping(false);
      });
  }

  function getNextStage(currentStage) {
    // Define the flow of stages based on the current stage
    switch (currentStage) {
      case "chooseMedium":
        return "chooseStyle";
      case "chooseStyle":
        return "chooseSubject";
      case "chooseSubject":
        return "grantingWish";
      case "grantingWish":
        return "dalleOutput";
      case "dalleOutput":
        return "generatePrompt";
      case "generatePrompt":
        // Add more stages as needed
        return "chooseMedium"; // Restart the conversation
      default:
        return "chooseMedium";
    }
  }

  function handleMessageResponse(response) {
    const newMessage = {
      message: response,
      sender: "ChatGPT",
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  const handleSelectChange = (e) => {
    setSelectedArtStyle(e.target.value);
  };

  const handleSelectSubmit = () => {
    setSelectVisible(false);
    handleSend(selectedArtStyle);
  };

  const toggleSelect = () => {
    setSelectVisible(!selectVisible);
  };

  const uploadImageToFirebaseStorage = async (imageURL) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, "hoodieImage.jpg");

    try {
      const downloadResponse = await axios.get(imageURL, {
        responseType: "arraybuffer",
      });

      await uploadBytes(storageRef, new Uint8Array(downloadResponse.data));
      console.log("Image uploaded to Firebase Storage");
    } catch (error) {
      console.error("Error while uploading the image:", error);
      // Handle the error
    }
  };

  const applyImage = async () => {
    console.log("applying image");

    try {
      const response = await axios.get(
        "https://main--stirring-dusk-267740.netlify.app/static/media/downloaded-image.b53a8e08fd6f23222419.jpg",
        {
          params: {
            imageUrl: dalleImage,
          },
        }
      );

      setHoodieImage(response.config.url);
      console.log(response.config.url);
      await uploadImageToFirebaseStorage(localDalleImage);
      console.log("Image uploaded successfully");
    } catch (error) {
      console.error("Error while downloading the image:", error);
    }

    console.log(hoodieImage);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ right: "-400" }}
        animate={{ right: toggleGenieChat ? "0px" : "100px" }}
        exit={{ right: toggleGenieChat ? "0" : "-400px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "6rem",
          right: "4rem",
          height: "600px",
          zIndex: "13",
          width: "400px",
          // backgroundColor: "red",
        }}
        className="genie-chat-container"
      >
        <MainContainer className="main-container">
          <ChatContainer className="chat-container">
            <MessageList
              className="message-list"
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
              {dalleImage ? (
                <Message
                  model={{
                    direction: "incoming",
                  }}
                >
                  <Message.ImageContent
                    src={dalleImage}
                    alt="dalle Image"
                    width={200}
                  />
                </Message>
              ) : null}
            </MessageList>
          </ChatContainer>
        </MainContainer>

        {stage === "chooseStyle" ? (
          <>
            {!selectVisible && (
              <button onClick={toggleSelect}>Open Select</button>
            )}
            {selectVisible && (
              <motion.div>
                <select value={selectedArtStyle} onChange={handleSelectChange}>
                  <option value="">Select an art style</option>
                  <option value="Impressionist">Impressionist</option>
                  <option value="Cubism">Cubism</option>
                  <option value="Abstract">Abstract</option>
                  {/* Add more art styles as needed */}
                </select>
                <button onClick={handleSelectSubmit}>Submit</button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div>
            <MessageInput
              // attachDisabled={false}
              attachButton={false}
              sendButton={false}
              placeholder="Type here"
              onSend={handleSend}
            />
          </motion.div>
        )}

        {/* <button onClick={generateImage}></button> */}
        <button onClick={applyImage}></button>
        <button onClick={handleDownloadImage}>Download and Post Image</button>
      </motion.div>
    </AnimatePresence>
  );
};

export default GenieChat;
