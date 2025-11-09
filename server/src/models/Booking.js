import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
  pg: { type: mongoose.Schema.Types.ObjectId, ref: "Pg", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sharing: { type: String, enum: ["single", "double", "triple", "quad"], required: true },
  months: { type: Number, default: 1 },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["reserved", "cancelled"], default: "reserved" },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Booking", BookingSchema);
