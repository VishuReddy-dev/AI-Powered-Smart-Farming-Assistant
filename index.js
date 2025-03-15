import express from "express";
import dotenv from "dotenv";
import healthAssessmentRoute from "./Routes/health_Assessment_Route.js";

dotenv.config();

const app = express();
app.use("/api", healthAssessmentRoute);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
