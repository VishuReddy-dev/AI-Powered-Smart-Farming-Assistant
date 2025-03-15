import Farmer from "../models/Farmer.js";
import jwt from "jsonwebtoken";

// Register Farmer
const registerFarmer = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ email });
    if (farmerExists) {
      return res
        .status(400)
        .json({ error: "Farmer already exists with this email" });
    }

    // Create farmer
    const farmer = await Farmer.create({
      name,
      email,
      password,
      phone,
      location,
    });

    // Generate token
    const token = farmer.generateToken();

    // Remove password from response
    const farmerObject = farmer.toObject();
    delete farmerObject.password;

    res.status(201).json({
      success: true,
      farmer: farmerObject,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login Farmer
const loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide email and password" });
    }

    // Find farmer and explicitly select the password field
    const farmer = await Farmer.findOne({ email }).select("+password");

    if (!farmer) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await farmer.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = farmer.generateToken();

    // Remove password from response
    const farmerObject = farmer.toObject();
    delete farmerObject.password;

    res.status(200).json({
      success: true,
      farmer: farmerObject,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get Farmer Profile
const getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmer.id);
    res.status(200).json({
      success: true,
      farmer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { registerFarmer, loginFarmer, getFarmerProfile };
