import React from "react";
import sampleAsset1 from "../assets/sampleAsset1.png";
import sampleAsset2 from "../assets/sampleAsset2.png";

const AssetLibrary = ({ setHoodieImage }) => {
  const assets = [
    sampleAsset1,
    sampleAsset1,
    sampleAsset2,
    sampleAsset1,
    sampleAsset2,
    sampleAsset1,
    sampleAsset2,
    sampleAsset1,
    sampleAsset1,
    sampleAsset2,
  ]; // Added more assets for demonstration

  const handleImageClick = (image) => {
    setHoodieImage(image);
  };

  return (
    <div className="asset-grid-container">
      {assets.map((asset, i) => (
        <img
          className="genie-x-asset"
          src={asset}
          key={i}
          alt={`asset ${i}`}
          onClick={() => handleImageClick(asset)}
        />
      ))}
    </div>
  );
};

export default AssetLibrary;
