import express from "express";
import PG from "../models/pg.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/uploads.js";   // ✔ use this only

const router = express.Router();

// ---------- ADD PG ----------
router.post(
  "/add",
  authMiddleware,
  upload.array("images", 10),  // ✔ accept multiple images
  async (req, res) => {
    try {
      if (req.user.role !== "broker") {
        return res.status(403).json({ message: "Only brokers can add PGs" });
      }

      const {
        name,
        rent,
        price,
        location,
        city,
        seats,
        ac,
        contact,
        description,
        amenities,
      } = req.body;

      // ✔ Extract uploaded image paths
      const imagePaths = req.files?.map((file) => file.path) || [];

      const newPg = await PG.create({
        name,
        rent,
        price,
        location,
        city,
        seats,
        ac,
        description,
        amenities: amenities ? JSON.parse(amenities) : [],
        images: imagePaths,   // ✔ save multiple images
        contact,
        broker: req.user._id,
        brokerEmail: req.user.email,
      });

      res.status(201).json({ message: "PG added successfully", pg: newPg });
    } catch (err) {
      console.log("PG ADD ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ---------- GET Broker’s own PGs ----------
router.get("/broker/my-pgs", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "broker") {
      return res.status(403).json({ message: "Only brokers allowed" });
    }

    const pgs = await PG.find({ broker: req.user._id });

    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- GET All PGs ----------
router.get("/", async (req, res) => {
  try {
    const pgs = await PG.find();
    res.json(pgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ---------- GET Single PG ----------
router.get("/:id", async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ error: "PG not found" });

    res.json(pg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- UPDATE PG ----------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    if (pg.broker.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updates = { ...req.body };
    delete updates.broker;
    delete updates.brokerEmail;

    const updated = await PG.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "PG updated", pg: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- DELETE PG ----------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    if (pg.broker.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await PG.findByIdAndDelete(req.params.id);

    res.json({ message: "PG deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
