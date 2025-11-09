import mongoose from "mongoose";
const ContactRequestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  pgName: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("ContactRequest", ContactRequestSchema);
