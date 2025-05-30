const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Clinician = require('./models/clinican.model');
require('dotenv').config();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;


app.get('/', (req,res) => {
    res.send("Hello from server");
});


mongoose.connect(mongoURI)
.then(()=>{
    console.log("connected to DB");
    
app.listen(3000, ()  => {
    console.log('connected to Server')
});
}).catch(() => {
    console.error("connection to server failed")
})

// Post new clinician
app.post('/api/clinician', async(req,res) => {
    try {
        console.log(req.body);
        await Clinician.create(req.body);
        res.send("data created in DB");
    } catch (error) {
        console.error("ERROR ", error);
    }
})


// Retrieve all clinicans
app.get('/api/clinicians', async(req,res) => {
    try {
        const clinicans = await Clinician.find({});
        res.status(200).json(clinicans);
        console.log('sent ');
    } catch (error) {
        console.error("ERROR ", error);
    }
})

//Retrieve clinician by id
app.get('/api/clinician/:id', async(req,res) => {
    try {
        const {id} = req.params
        const clinicans = await Clinician.findById(id);
        res.status(200).json(clinicans);
        console.log('sent ');
    } catch (error) {
        console.error("ERROR ", error);
    }
})