import express from "express";
import {
  identifyPlantDisease,
  getFarmerAssessments,
} from "../controllers/health_Assessment_Controller.js";
import multer from "multer";
import {
  registerFarmer,
  loginFarmer,
  getFarmerProfile,
} from "../controllers/farmerAuthController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/register", registerFarmer);
router.post("/login", loginFarmer);
router.get("/profile", protect, getFarmerProfile);
router.post("/assess-plant", upload.single("image"), identifyPlantDisease);
router.get("/assessments/:farmerId", getFarmerAssessments);

export default router;
