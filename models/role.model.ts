import mongoose, { Schema, Document } from "mongoose";

// export interface IRole extends Document {
//   ID: Number;
//   title: string;
// }

const roleSchema = new Schema(
  {
    ID: {
      type: Number,
      unique: true,
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
