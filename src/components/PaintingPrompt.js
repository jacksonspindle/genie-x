import React, { useState, useRef } from "react";

const PaintingPrompt = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [words, setWords] = useState({
    Subject: "Subject",
    Adjective: "Adjective",
    Setting: "Setting",
    Verb: "Verb",
    Style: "Style",
    ColorScheme: "X",
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const replacements = {
    Subject: ["Dog", "Building", "Car"],
    Adjective: ["Happy", "Tall", "Bright"],
    Verb: ["Running", "Fighting", "Eating"],
    Setting: ["Park", "Street", "Beach"],
    Style: ["Monochrome", "Vintage", "HDR"],
    ColorScheme: ["Warm", "Cool", "Monochromatic"],
  };

  const handleClick = (key, event) => {
    const rect = event.target.getBoundingClientRect();
    setPosition({ x: rect.x, y: rect.bottom });
    setSelectedWord(key);
  };

  const selectReplacement = (key, replacement) => {
    setWords((prevWords) => ({
      ...prevWords,
      [key]: replacement,
    }));
    setSelectedWord(null);
  };

  return (
    <div ref={ref}>
      <h1>
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("Style", e)}
        >
          {words.Style}
        </span>{" "}
        painting of{" "}
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("Adjective", e)}
        >
          {words.Adjective}
        </span>{" "}
        +{" "}
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("Subject", e)}
        >
          {words.Subject}
        </span>{" "}
        +{" "}
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("Verb", e)}
        >
          {words.Verb}
        </span>{" "}
        in{" "}
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("Setting", e)}
        >
          {words.Setting}
        </span>{" "}
        with a{" "}
        <span
          className="clickable"
          style={{ color: "red" }}
          onClick={(e) => handleClick("ColorScheme", e)}
        >
          {words.ColorScheme}
        </span>{" "}
        color scheme
      </h1>
      {selectedWord && (
        <div className="dropdown" style={{ left: position.x, top: position.y }}>
          {replacements[selectedWord].map((replacement, index) => (
            <div
              key={index}
              onClick={() => selectReplacement(selectedWord, replacement)}
            >
              {replacement}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaintingPrompt;
