import mongoose from "mongoose";

const pgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rent: { type: Number, required: true },
    price: { type: Number },
    location: { type: String, required: true },
    city: { type: String, required: true },
    seats: { type: Number, default: 1 },
    ac: { type: Boolean, default: false },

    contact: { type: String, required: true },

    description: String,
    amenities: [String],
    images: {
  type: [String],
  default: [],
},


    // FIXED → Broker belongs to User model
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    brokerEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PG", pgSchema);
