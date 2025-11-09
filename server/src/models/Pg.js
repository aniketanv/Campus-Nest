import mongoose from "mongoose";

const RentSchema = new mongoose.Schema({
  sharing: { type: String, enum: ["single", "double", "triple", "quad"], required: true },
  price: { type: Number, required: true }
}, { _id: false });

const PgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: { type: String, required: true, index: true },
  address: String,
  city: String,
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  facilities: {
    wifi: { type: Boolean, default: false },
    hotWater: { type: Boolean, default: false },
    timings: { type: String, default: "24x7" }
  },
  rentOptions: [RentSchema],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  photos: [String],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Pg", PgSchema);
