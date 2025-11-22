// import express from "express";
// // import Broker from "../models/Broker.js";
// import Pg from "../models/Pg.js";
// import Booking from "../models/Booking.js";

// const router = express.Router();

// // 👉 Register Broker
// // router.post("/register", async (req, res) => {
// //   try {
// //     const broker = new Broker(req.body);
// //     await broker.save();
// //     res.status(201).json({ message: "Broker registered", broker });
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // 👉 Add PG (only broker)
// router.post("/pgs", async (req, res) => {
//   try {
//     const pg = new Pg({ ...req.body, broker: req.body.brokerId });
//     await pg.save();
//     res.status(201).json(pg);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 👉 Get all PGs for broker
// router.get("/pgs/:brokerId", async (req, res) => {
//   try {
//     const pgs = await Pg.find({ broker: req.params.brokerId });
//     res.json(pgs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 👉 Update PG
// router.put("/pgs/:id", async (req, res) => {
//   try {
//     const pg = await Pg.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(pg);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // 👉 Delete PG
// router.delete("/pgs/:id", async (req, res) => {
//   try {
//     await Pg.findByIdAndDelete(req.params.id);
//     res.json({ message: "PG deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 👉 Get bookings for broker’s PGs
// router.get("/bookings/:brokerId", async (req, res) => {
//   try {
//     const pgs = await Pg.find({ broker: req.params.brokerId });
//     const pgIds = pgs.map(pg => pg._id);

//     const bookings = await Booking.find({ pg: { $in: pgIds } }).populate("user").populate("pg");
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
