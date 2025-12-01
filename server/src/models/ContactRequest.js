import mongoose from "mongoose";

const ContactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ContactRequest", ContactRequestSchema);
