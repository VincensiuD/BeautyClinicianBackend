const mongoose = require('mongoose');

const ClinicianSchema = mongoose.Schema(
    {
        ID: {
            type: Number,
            unique: true,
            sparse: true // Makes it optional
          },
        
        name: {
            type: String,
            required: true,
        },

        title : {
            type: String,
            required: true,

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
        timestamps:true
    }
);

const Clinician = mongoose.model("Clinician", ClinicianSchema);

module.exports = Clinician;