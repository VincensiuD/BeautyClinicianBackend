import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    roleID: {
      type: Number,
      ref: "Role",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
