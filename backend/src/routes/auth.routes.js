import { Router } from "express";
import { registerUser, uploadResume } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Registration route - only logo upload for startups (optional)
// Students can register with JSON, startups can optionally include logo
router
  .route("/register")
  .post(upload.fields([{ name: "logo", maxCount: 1 }]), registerUser);

// Resume upload route - requires authentication
// The studentId is extracted from the authenticated user (req.user)
router
  .route("/upload-resume")
  .post(verifyJWT, upload.single("resume"), uploadResume);

export default router;
