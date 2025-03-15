import jwt from "jsonwebtoken";
import Farmer from "../models/Farmer.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ error: "Not authorized to access this route" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get farmer from token
    req.farmer = await Farmer.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized to access this route" });
  }
};

export { protect };
