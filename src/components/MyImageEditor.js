// import { createRoot } from "react-dom/client";
// import "./index.css";
import * as React from "react";
import { useEffect, useRef } from "react";
import { ImageEditorComponent } from "@syncfusion/ej2-react-image-editor";
import { Browser, isNullOrUndefined, getComponent } from "@syncfusion/ej2-base";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIfEx+WmFZfV1gcV9HZFZVQmY/P1ZhSXxQd0djWH5ZcXBRQGNaVE0="
);

const Default = ({ hoodieImage }) => {
  let imgObj = useRef(null);

  const imageEditorCreated = () => {
    // Open the hoodieImage by default
    imgObj.current.open(hoodieImage);

    // Rest of your logic...
  };

  // Handler used to reposition the tooltip on page scroll
  const onScroll = () => {
    if (document.getElementById("image-editor_sliderWrapper")) {
      let slider = getComponent(
        document.getElementById("image-editor_sliderWrapper"),
        "slider"
      );
      slider.refreshTooltip(slider.tooltipTarget);
    }
  };
  if (!isNullOrUndefined(document.getElementById("right-pane"))) {
    document
      .getElementById("right-pane")
      .addEventListener("scroll", onScroll.bind(this));
  }
  return (
    <div className="control-pane" style={{ width: "700px", height: "500px" }}>
      <ImageEditorComponent
        id="image-editor"
        ref={imgObj}
        created={imageEditorCreated}
      ></ImageEditorComponent>
    </div>
  );
};
export default Default;

// const root = createRoot(document.getElementById("sample"));
// root.render(<Default />);
