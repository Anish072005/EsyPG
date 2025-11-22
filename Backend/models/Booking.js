import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pg: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },

    // These fields help frontend display everything easily
    name: { type: String },
    price: { type: Number },
    image: { type: String },

    status: { type: String, default: "Booked" },
    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
