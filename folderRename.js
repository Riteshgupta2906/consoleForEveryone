const fs = require("fs");
const path = require("path");

// Configuration
const sourceDir = "./public/images"; // Source directory containing your images
const prefix = "fashion-"; // Prefix for the new filenames
let counter = 1; // Starting number for renaming

// Supported image extensions
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Create directory if it doesn't exist
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
  console.log(`Created directory: ${sourceDir}`);
}

// Get all files from the directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  // Filter only image files and sort them
  const imageFiles = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    })
    .sort();

  // Process each image file
  imageFiles.forEach((oldName) => {
    const extension = path.extname(oldName);
    const newName = `${prefix}${counter}${extension.toLowerCase()}`;
    const oldPath = path.join(sourceDir, oldName);
    const newPath = path.join(sourceDir, newName);

    // Rename the file
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`Error renaming ${oldName}:`, err);
      } else {
        console.log(`Renamed: ${oldName} → ${newName}`);
      }
    });

    counter++;
  });

  console.log(`\nTotal images processed: ${imageFiles.length}`);
});
