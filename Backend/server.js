import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import pgRoutes from "./routers/pg.routers.js";
import authRoutes from "./routers/auth.js";
import bookingRoutes from "./routers/bookings.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// SERVE UPLOADED IMAGES
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(8080, () => console.log("Server running on 8080"));
