import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["owner", "seeker"], required: true },
  phone: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("User", UserSchema);
