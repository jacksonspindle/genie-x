import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GenieChat = ({ isOpen }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = "YOUR_CHATGPT_API_ENDPOINT"; // Replace with your ChatGPT API endpoint

  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    setChatHistory([...chatHistory, { role: "user", content: userMessage }]);
    setUserMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setChatHistory([
        ...chatHistory,
        { role: "chatbot", content: data.message },
      ]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Automatically scroll to the bottom of the chat history
      const chatContainer = document.getElementById("chat-container");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [isOpen, chatHistory]);

  return (
    <motion.div
      className="genie-chat-container"
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ duration: 0.5 }}
    >
      <div id="chat-container" className="chat-container">
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        {isLoading && <div className="loading">Loading...</div>}
      </div>
    </motion.div>
  );
};

export default GenieChat;
