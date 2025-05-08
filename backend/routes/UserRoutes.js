import express from "express"
import {authenticateJWT} from "../middleware/authMiddleware.js"
import {upload} from "../config/cloudinary.js"
import { signup,login,getUserProfile,
  getUploaderDetails,updateProfile,
  updatePassword } from "../controllers/userController.js";

const router = express.Router();
router.post("/signup",upload.single("profilePhoto"),signup);
router.post("/login",login)
router.get("/user",authenticateJWT,getUserProfile)
router.get("/uploader",authenticateJWT,getUploaderDetails)
router.put("/profile",authenticateJWT,upload.single('profilePhoto'),updateProfile)
router.put("/update-password",authenticateJWT,updatePassword)

export default router;