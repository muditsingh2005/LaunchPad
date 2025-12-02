import {
  getStartupProfile,
  updateStartupProfile,
  deleteStartupAccount,
  uploadStartupLogo,
} from "../controllers/user.crud.controller.js";
import { verifyJWT, isStartup } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/profile").get(verifyJWT, isStartup, getStartupProfile);

router.route("/profile/update").put(verifyJWT, isStartup, updateStartupProfile);

router
  .route("/profile/delete")
  .delete(verifyJWT, isStartup, deleteStartupAccount);

router.route("/profile/:id").get(verifyJWT, isStartup, getStartupProfile);

router
  .route("/profile/logo")
  .post(verifyJWT, isStartup, upload.single("logo"), uploadStartupLogo);

export default router;
