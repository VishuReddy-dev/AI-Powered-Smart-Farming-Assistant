import express from "express";
import { identifyPlantDisease } from "../controllers/health_Assessment_Controller.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/health_assessment", upload.single("image"), identifyPlantDisease);

export default router;
