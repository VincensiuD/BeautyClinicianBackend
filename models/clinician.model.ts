import mongoose from "mongoose";

const ClinicianSchema = new mongoose.Schema(
  {
    ID: {
      type: Number,
      unique: true,
      sparse: true, // Makes it optional
    },

    name: {
      type: String,
      required: true,
    },

    titleID: {
      type: Number,
      required: true,
      ref: "Title",
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Clinician = mongoose.model("Clinician", ClinicianSchema);

export interface IClinician {
    ID: number;
    name:string;
    title: string;
    description: string;
    image: string;
}