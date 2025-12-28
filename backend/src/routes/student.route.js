import {
  getStudentProfile,
  getPublicStudentProfile,
  updateStudentProfile,
  uploadStudentProfilePicture,
  deleteStudentAccount,
  uploadResume,
} from "../controllers/user.crud.controller.js";
import { verifyJWT, isStudent } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

// Private routes - student only
router.route("/profile").get(verifyJWT, isStudent, getStudentProfile);
router.route("/profile/update").put(verifyJWT, isStudent, updateStudentProfile);

// Public profile - accessible by all authenticated users (students & startups)
router.route("/public-profile/:id").get(verifyJWT, getPublicStudentProfile);

router
  .route("/profile/picture/upload")
  .post(
    verifyJWT,
    isStudent,
    upload.single("profilePicture"),
    uploadStudentProfilePicture
  );

router
  .route("/upload-resume")
  .post(verifyJWT, isStudent, upload.single("resume"), uploadResume);

router
  .route("/profile/delete")
  .delete(verifyJWT, isStudent, deleteStudentAccount);

export default router;
