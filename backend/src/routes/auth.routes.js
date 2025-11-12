import { Router } from "express";
import {
  registerStudent,
  registerStartup,
  uploadResume,
  loginUser,
  logoutUser,
} from "../controllers/user.register.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register/student").post(registerStudent);

router
  .route("/register/startup")
  .post(upload.fields([{ name: "logo", maxCount: 1 }]), registerStartup);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/upload-resume")
  .post(verifyJWT, upload.single("resume"), uploadResume);

export default router;
