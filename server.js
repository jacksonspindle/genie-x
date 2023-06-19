const express = require("express");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://main--stirring-dusk-267740.netlify.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const imagesDirectory = path.join(__dirname, "..", "src", "assets");
if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory);
}

app.get("/download-image", async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    const imageResponse = await axios.get(imageUrl, { responseType: "stream" });

    const fileName = "downloaded-image.jpg";
    const filePath = path.join(imagesDirectory, fileName);

    const writeStream = fs.createWriteStream(filePath);
    imageResponse.data.pipe(writeStream);

    writeStream.on("finish", () => {
      res.send({ success: true, message: "Image downloaded successfully." });
    });

    writeStream.on("error", (error) => {
      console.error("Error while downloading the image:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to download the image." });
    });
  } catch (error) {
    console.error("Error while downloading the image:", error);
    res
      .status(500)
      .send({ success: false, message: "Failed to download the image." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
