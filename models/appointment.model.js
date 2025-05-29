const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema(
    {
        
        clinicianID: {
            type: Number,
            required: true,
        },

        clientID: {
            type: Number,
            required: true,
        },

        startDate : {
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
        }
    },
    {
        timestamps:true
    }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;