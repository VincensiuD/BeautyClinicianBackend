import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    clinicianID: {
      type: Number,
      required: true,
    },

    clientNumber: {
      type: String,
      required: true,
    },

    dateTimeStart: {
      type: Date,
      required: true,
    },

    dateTimeEnd: {
      type: Date,
      required: true,
    },

    comments: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);

export interface IAppointment {
  ID: number;
  clinicianID: number;
  clientNumber: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  comments?: string;
}
