const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public/input-images";
const outputDir = "./public/images";
const targetWidth = 800;
const targetHeight = 1200;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create subdirectories for different versions
const croppedDir = path.join(outputDir, "cropped");
const paddedDir = path.join(outputDir, "padded");
fs.mkdirSync(croppedDir, { recursive: true });
fs.mkdirSync(paddedDir, { recursive: true });

// Utility function to preview an image's dimensions and aspect ratio
async function getImageInfo(filepath) {
  try {
    const metadata = await sharp(filepath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      aspectRatio: (metadata.width / metadata.height).toFixed(2),
    };
  } catch (err) {
    console.error("Error getting image info:", err);
    return null;
  }
}

// Main processing function
async function processImages() {
  try {
    const files = await fs.promises.readdir(inputDir);

    console.log("Analyzing original images...\n");

    // Process each file
    for (let [index, file] of files.entries()) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const inputPath = path.join(inputDir, file);

        try {
          // Get and log original image info
          const info = await getImageInfo(inputPath);
          if (info) {
            console.log(`${file}:`);
            console.log(`Original Dimensions: ${info.width}x${info.height}`);
            console.log(`Aspect Ratio: ${info.aspectRatio}`);
          }

          // Version 1: Cropped version
          await sharp(inputPath)
            .resize(targetWidth, targetHeight, {
              fit: "cover",
              position: "center",
            })
            .webp({ quality: 85 })
            .toFile(path.join(croppedDir, `fashion-${index + 1}.webp`));

          // Version 2: Padded version
          await sharp(inputPath)
            .resize(targetWidth, targetHeight, {
              fit: "contain",
              background: { r: 255, g: 255, b: 255, alpha: 1 },
            })
            .webp({ quality: 85 })
            .toFile(path.join(paddedDir, `fashion-${index + 1}.webp`));

          console.log(
            `Processed ${file} -> fashion-${index + 1}.webp (both versions)`
          );
          console.log(`New dimensions: ${targetWidth}x${targetHeight}`);
          console.log("---");
        } catch (err) {
          console.error(`Error processing ${file}:`, err);
        }
      }
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}

// Run the script
processImages().catch((err) => {
  console.error("Error in main process:", err);
});
