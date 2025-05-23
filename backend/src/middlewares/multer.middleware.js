import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "eLearning_uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }]
  }
});

const upload = multer({ storage: storage });

export { upload };
