import React, { useRef, useState } from "react";

const ImageUpload = ({ setHoodieImage }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setHoodieImage(imageUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-upload-container">
      <input
        ref={fileInputRef}
        className="upload-image-input"
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }} // hide the default input
      />
      <button onClick={handleButtonClick} className="custom-upload-button">
        Choose File
      </button>
      <div className="uploaded-image-container">
        {image ? (
          <img
            src={image}
            alt="Uploaded"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        ) : (
          <div>Upload an Image</div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
