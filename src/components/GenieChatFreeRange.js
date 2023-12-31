import React, { useEffect, useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import { Configuration, OpenAIApi } from "openai";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

const GenieChatFreeRange = ({ isOpen }) => {
  const apiKey = "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";
  const [typing, setTyping] = useState(false);
  const [dalleImage, setDalleImage] = useState("");

  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const generateImage = async () => {
    console.log("generating image");
    const res = await openai.createImage({
      prompt: dalleProptString,
      n: 1,
      size: "1024x1024",
    });

    console.log(res.data.data[0].url);
    setDalleImage(res.data.data[0].url);
  };

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

  useEffect(() => {
    console.log(dalleProptString);
    // setDallePrompt(dallePrompt.join(" "));
  });

  useEffect(() => {
    if (stage === "dalleOutput" && !dallePrompt.includes("undefined")) {
      generateImage();
    }
  }, [stage]);

  async function processMessageToChatGPT(chatMessages, currentStage) {
    const userMessage = chatMessages[chatMessages.length - 1].message;

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

  return (
    <div
      style={{
        position: "absolute",
        top: "6rem",
        right: "4rem",
        height: "600px",
        zIndex: "13",
        width: "400px",
        // backgroundColor: "blue",
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
            <div>
              <select value={selectedArtStyle} onChange={handleSelectChange}>
                <option value="">Select an art style</option>
                <option value="Impressionist">Impressionist</option>
                <option value="Cubism">Cubism</option>
                <option value="Abstract">Abstract</option>
                {/* Add more art styles as needed */}
              </select>
              <button onClick={handleSelectSubmit}>Submit</button>
            </div>
          )}
        </>
      ) : (
        <MessageInput placeholder="Type message here" onSend={handleSend} />
      )}

      <button onClick={generateImage}></button>
    </div>
  );
};

export default GenieChatFreeRange;
