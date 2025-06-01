import express, { Request, Response } from "express";
import { User } from "./models/user.model";
const mongoose = require("mongoose");
const Clinician = require("./models/clinician.model.ts");
const { Role } = require("./models/role.model.ts");
require("dotenv").config();

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const bcrypt = require("bcrypt");

app.get("/", (req, res) => {
  res.send("Hello from server");
});

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to DB");

    app.listen(3000, () => {
      console.log("connected to Server");
    });
  })
  .catch(() => {
    console.error("connection to server failed");
  });

// Post new clinician
app.post("/api/clinician", async (req, res) => {
  try {
    console.log(req.body);
    await Clinician.create(req.body);
    res.send("data created in DB");
  } catch (error) {
    console.error("ERROR ", error);
  }
});

// Retrieve all clinicans
app.get("/api/clinicians", async (req, res) => {
  try {
    const clinicans = await Clinician.find({});
    res.status(200).json(clinicans);
    console.log("sent ");
  } catch (error) {
    console.error("ERROR ", error);
  }
});

//Retrieve clinician by id
app.get("/api/clinician/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const clinicans = await Clinician.findById(id);
    res.status(200).json(clinicans);
    console.log("sent ");
  } catch (error) {
    console.error("ERROR ", error);
  }
});

//Edit clinician
app.put("/api/clinician", async (req, res) => {});

const users = [];

//create user
app.post("/api/user", async (req, res) => {
  try {
    const { password, mobileNumber, name, roleID } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt, hashedPassword);

    if(mobileNumber.length < 10 && mobileNumber.startsWith("04")){
      throw new Error("Mobile number should be 10 digits and starts with 04");
    }

    const Roles = await Role.findOne({ID: roleID});

    if(Roles){
      const newUser = { roleID, password: hashedPassword, name, mobileNumber };
      await User.create(newUser);
      res.status(200).send("New user created");
    }
    else{
      throw new Error("Invalid Role");
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("ERROR: " + error);
  }
});

//create role
app.post("/api/role", async (req, res) => {
  try {
    await Role.create(req.body);
    res.status(201).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});
