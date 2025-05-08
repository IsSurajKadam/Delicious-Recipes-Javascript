// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipes",                 
    allowed_formats: ["jpg", "jpeg", "png"],

  },
});

// 3. Export a multer instance using that storage
export const upload = multer({ storage });

// (Optionally) also export cloudinary itself if you need it elsewhere
export default cloudinary;
