import express from "express";
import auth from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import PG from "../models/pg.js";

const router = express.Router();

// ------------------ CREATE BOOKING ------------------
router.post("/", auth, async (req, res) => {
  try {
    const { pgId } = req.body;
    const userId = req.user._id;

    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ error: "PG not found" });

    const booking = await Booking.create({
      user: userId,
      pg: pgId,
      name: pg.name,
      price: pg.price,
      image: pg.images?.[0] || null,
      status: "Booked",
      bookedAt: new Date(),
    });

    res.status(201).json(booking);
  } catch (err) {
    console.log("BOOKING ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET USER BOOKINGS ------------------
router.get("/me", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log("USER BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------ GET BROKER BOOKINGS ------------------
router.get("/broker/:id", auth, async (req, res) => {
  try {
    const brokerId = req.params.id;

    // Fetch all bookings + PG + User info
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("pg", "name images broker");

    const filtered = bookings.filter(
      (b) => b.pg && b.pg.broker?.toString() === brokerId
    );

    res.json(filtered);
  } catch (err) {
    console.log("BROKER BOOKINGS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// -----//delete bookings=---
router.delete("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Only user who booked can delete
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.log("DELETE BOOKING ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
