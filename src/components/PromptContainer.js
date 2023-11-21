import React from "react";
import PhotoPrompt from "./PhotoPrompt";
// import PaintingPrompt from "./PaintingPrompt";
// import ClaymationPrompt from "./ClaymationPrompt";
// import ThreeDRender from "./ThreeDRender";
// import SculpturePrompt from "./SculpturePrompt";

const PromptContainer = ({
  isFreeRange,
  setIsFreeRange,
  freeRangeInput,
  dalleImages,
  setDalleImages,
  selectedImageIndex,
  setSelectedImageIndex,
  setHoodieImage,
  setEditPopup,
  editPopup,
  hoodieImage,
  freeRangeToggle,
  setFreeRangeToggle,
  freeRangePrompt,
}) => {
  // const [prompt, setPrompt] = useState(null);
  return (
    <div>
      {/* <div className="prompt-container"> */}
      <div className="prompt-container-content">
        {/* {prompt === null ? (
            <>
              <h1 style={{ fontSize: "24px" }}>Select Your Medium</h1>
              <div className="prompt-medium-options">
                <button onClick={() => setPrompt("Photo")}>Photo</button>
                <button onClick={() => setPrompt("Painting")}>Painting</button>
                <button onClick={() => setPrompt("3D Render")}>
                  3D Render
                </button>
                <button onClick={() => setPrompt("3D Render")}>
                  Claymation
                </button>
                <button onClick={() => setPrompt("Sculpture")}>
                  Sculpture
                </button>
              </div>
            </>
          ) : (
            ""
          )}

          {prompt === "Photo" ? (
            <PhotoPrompt setHoodieImage={setHoodieImage} />
          ) : null}
          {prompt === "Painting" ? <PaintingPrompt /> : null}
          {prompt === "3D Render" ? <ThreeDRender /> : null}
          {prompt === "Claymation" ? <ClaymationPrompt /> : null}
          {prompt === "Sculpture" ? <SculpturePrompt /> : null} */}
        <PhotoPrompt
          isFreeRange={isFreeRange}
          setIsFreeRange={setIsFreeRange}
          freeRangeInput={freeRangeInput}
          hoodieImage={hoodieImage}
          dalleImages={dalleImages}
          setDalleImages={setDalleImages}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          setHoodieImage={setHoodieImage}
          setEditPopup={setEditPopup}
          editPopup={editPopup}
          freeRangeToggle={freeRangeToggle}
          setFreeRangeToggle={setFreeRangeToggle}
          freeRangePrompt={freeRangePrompt}
        />
      </div>
      {/* </div> */}
    </div>
  );
};

export default PromptContainer;
