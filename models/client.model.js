const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema(
    {
        
        lastName: {
            type: String,
            required: true,
        },

        firstName: {
            type: String,
            required: true,
        },

        mobileNumber : {
            type: String,
            required: true,
        },
    },
    {
        timestamps:true
    }
);

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;