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

      // Save the downloaded image to your proxy server
      await saveImageToProxyServer(response.data);

      // Handle the success of the image download and saving to the proxy server
    } catch (error) {
      console.error("Error while downloading the image:", error);
      // Handle the error
    }
  };

  // Function to save the image to your proxy server
  const saveImageToProxyServer = async (imageData) => {
    try {
      // Make a POST request to your proxy server endpoint to save the image
      await axios.post(
        "https://mellifluous-cendol-c1b874.netlify.app/",
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

  useEffect(() => {
    console.log(stage, selectVisible);
  }, [stage, selectVisible]);

  const onMessageSubmit = (message) => {
    if (message) {
      setTyping(true);
      setMessages([
        ...messages,
        {
          message,
          sender: "You",
        },
      ]);

      if (stage === "chooseMedium") {
        if (message.toLowerCase().includes("photo")) {
          setStage("chooseSubject");
          setDallePrompt([...dallePrompt, "painting"]);

          setDallePromptString(
            dalleProptString +
              "start with a photo of a natural scene and apply an artistic style to it."
          );
        } else if (message.toLowerCase().includes("paint")) {
          setStage("chooseSubject");
          setDallePrompt([...dallePrompt, "painting"]);

          setDallePromptString(
            dalleProptString +
              "start with a blank canvas and create a painting with a specific style."
          );
        } else if (message.toLowerCase().includes("render")) {
          setStage("chooseSubject");
          setDallePrompt([...dallePrompt, "3D rendering"]);

          setDallePromptString(
            dalleProptString +
              "start with a 3D model and render it with a specific lighting and material setup."
          );
        } else if (message.toLowerCase().includes("draw")) {
          setStage("chooseSubject");
          setDallePrompt([...dallePrompt, "drawing"]);

          setDallePromptString(
            dalleProptString +
              "start with a blank canvas and draw a scene or object in a specific style."
          );
        } else {
          setMessages([
            ...messages,
            {
              message:
                "I'm sorry, I couldn't understand your request. Please choose one of the following: photograph, painting, 3D render, or drawing.",
              sender: "ChatGPT",
            },
          ]);
          setTyping(false);
        }
      } else if (stage === "chooseSubject") {
        setStage("provideDetails");

        if (message.toLowerCase().includes("natural scene")) {
          setDallePrompt([...dallePrompt, "a natural scene"]);
        } else if (message.toLowerCase().includes("cityscape")) {
          setDallePrompt([...dallePrompt, "a cityscape"]);
        } else if (message.toLowerCase().includes("portrait")) {
          setDallePrompt([...dallePrompt, "a portrait"]);
        } else if (message.toLowerCase().includes("animal")) {
          setDallePrompt([...dallePrompt, "an animal"]);
        } else if (message.toLowerCase().includes("object")) {
          setDallePrompt([...dallePrompt, "an object"]);
        } else {
          setMessages([
            ...messages,
            {
              message:
                "I'm sorry, I couldn't understand your request. Please choose one of the following: natural scene, cityscape, portrait, animal, or object.",
              sender: "ChatGPT",
            },
          ]);
          setTyping(false);
        }
      } else if (stage === "provideDetails") {
        setStage("completed");
        setTyping(false);
        setDallePrompt([...dallePrompt, message]);
        setDallePromptString(dalleProptString + message);
        generateImage();
      }
    }
  };

  return (
    <AnimatePresence>
      {isGenieChatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            bottom: 0,
            right: 0,
            maxWidth: "400px",
            width: "100%",
            margin: "0 auto",
            height: "450px",
            zIndex: "999",
          }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {messages.map((message, index) => (
                  <Message
                    key={index}
                    model={{
                      message: message.message,
                      sentTime: "Now",
                      sender: message.sender,
                    }}
                    // more options
                  />
                ))}
              </MessageList>
              {typing && <TypingIndicator />}
              <MessageInput
                placeholder="Type a message"
                onSend={onMessageSubmit}
              />
            </ChatContainer>
          </MainContainer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenieChat;
