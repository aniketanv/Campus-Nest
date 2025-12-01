import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pg: { type: Schema.Types.ObjectId, ref: "Pg", required: true },

    sharing: {
      type: String,
      enum: ["single", "double", "triple", "quad"],
      required: true,
    },

    months: { type: Number, default: 1, min: 1 },
    amount: { type: Number, required: true }, // total amount

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
