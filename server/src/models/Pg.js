import mongoose from "mongoose";

const { Schema } = mongoose;

const RentOptionSchema = new Schema(
  {
    sharing: {
      type: String,
      enum: ["single", "double", "triple", "quad"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const PgSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },

    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    // ⭐ NEW: track which users rated
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        value: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
      },
    ],

    facilities: {
      wifi: { type: Boolean, default: false },
      hotWater: { type: Boolean, default: false },
      timings: { type: String, default: "24x7" },
    },

    rentOptions: {
      type: [RentOptionSchema],
      required: true,
      validate: {
        validator: (opts) => opts.some((o) => o.sharing === "single"),
        message: "Single sharing rent is mandatory",
      },
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    photos: { type: [String], default: [] },
    foodTimingsPhoto: String,
  },
  { timestamps: true }
);

export default mongoose.model("Pg", PgSchema);
