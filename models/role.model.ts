import mongoose, { Schema, Document } from "mongoose";

const roleSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Role = mongoose.model("Role", roleSchema);
