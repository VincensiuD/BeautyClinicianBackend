import mongoose, { Schema, Document } from "mongoose";

const titleSchema = new Schema(
  {
    _id: {
      type: Number,
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
