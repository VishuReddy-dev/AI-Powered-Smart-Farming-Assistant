import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Farmer from "../models/Farmer.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const generateTreatmentPlan = async (diseases) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as a plant pathologist. For these detected diseases: ${diseases
      .map((d) => `${d.name} (${(d.probability * 100).toFixed(1)}% confidence)`)
      .join(", ")}. 
        Provide:
        1. Immediate treatment steps
        2. Long-term prevention strategies
        3. Organic alternatives
        4. Chemical solutions (if necessary)
        Format as JSON with markdown formatting in descriptions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return JSON.parse(
      response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
    );
  } catch (error) {
    return {
      error: "Treatment recommendation unavailable",
      details: error.message,
    };
  }
};
const identifyPlantDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no image uploaded" });
    }
    const { farmerId } = req.body; // Assuming farmerId is sent in request
    if (!farmerId) {
      return res.status(400).json({ error: "Farmer ID is required" });
    }

    // Save image to server
    const uploadDir = path.join(__dirname, "..", "uploads", "plant-images");
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, req.file.buffer);
    const apiKey = process.env.API_KEY;
    const API_URL = "https://api.plant.id/v2/health_assessment";
    const response = await axios.post(
      API_URL,
      {
        images: [
          `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`,
        ],
        organs: ["leaf", "flower"],
        health_assessment: true,
        details: ["disease", "description", "treatment"],
      },
      {
        headers: { "Content-Type": "application/json", "Api-Key": apiKey },
      }
    );
    const enhancedResponse = {
      ...response.data,
      treatment_plan: await generateTreatmentPlan(
        response.data.health_assessment.diseases
      ),
    };
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    farmer.healthAssessments.push({
      imageUrl: filePath,
      results: enhancedResponse,
    });

    await farmer.save();

    res.status(200).json({
      ...enhancedResponse,
      assessmentId:
        farmer.healthAssessments[farmer.healthAssessments.length - 1]._id,
    });
  } catch (error) {
    console.error("Error in plant disease identification:", error);
    res.status(500).json({ error: error.message });
  }
};
const getFarmerAssessments = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.status(200).json(farmer.healthAssessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { identifyPlantDisease, getFarmerAssessments };
