import mongoose, { Schema, Document } from "mongoose";

const titleSchema = new Schema(
  {
    _id: {
      type: Number,
      unique: true,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Title = mongoose.model("Title", titleSchema);
