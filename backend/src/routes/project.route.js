import {
  createProject,
  updateProject,
  deleteProject,
  getStartupProjects,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/create").post(verifyJWT, createProject);

router.route("/my-projects").get(verifyJWT, getStartupProjects);

router.route("/update/:id").put(verifyJWT, updateProject);

router.route("/delete/:id").delete(verifyJWT, deleteProject);

export default router;
