import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    clinicianID: {
      type: Number,
      required: true,
    },

    clientID: {
      type: Number,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    current: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
