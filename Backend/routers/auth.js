import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// import Broker from "../models/Broker.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// User Register
router.post("/register-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword,role:"user" });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Broker Register
router.post("/register-broker", async (req, res) => {
  try {
    const { name, email, password,agencyName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newBroker = new User({ name, email, password: hashedPassword, role: "broker", agencyName: agencyName });
    await newBroker.save();

    res.status(201).json({ message: "Broker registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post("/login-user", async (req, res) => {
  try {
    const { email, password,role } = req.body;
    const user = await User.findOne({ email,role:"user" });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get profile of logged in user
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

// Broker Login
router.post("/login-broker", async (req, res) => {
  try {
    const { email, password,role } = req.body;
    const broker = await User.findOne({ email,role:"broker" });
    if (!broker) return res.status(400).json({ message: "Broker not found" });

    const isMatch = await bcrypt.compare(password, broker.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: broker._id,role: broker.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, role: role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
