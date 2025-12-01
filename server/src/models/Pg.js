import mongoose from "mongoose";

const { Schema } = mongoose;

// Sub-schema for rent options
const RentOptionSchema = new Schema(
  {
    sharing: {
      type: String,
      enum: ["single", "double", "triple", "quad"],
      required: true,
    },
    price: { type: Number, required: true }, // per month
  },
  { _id: false }
);

const PgSchema = new Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },

    rating: { type: Number, default: 0 },

    facilities: {
      wifi: { type: Boolean, default: false },
      hotWater: { type: Boolean, default: false },
      timings: { type: String, default: "" }, // e.g. "24x7"
    },

    rentOptions: {
      type: [RentOptionSchema],
      default: [],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    photos: {
      type: [String], // image URLs
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pg", PgSchema);
