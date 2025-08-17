import express, { Request, Response, NextFunction } from "express";
import { User } from "./models/user.model";
import { Title } from "./models/title.models";
import { Clinician } from "./models/clinician.model";
import {Appointment} from "./models/appointment.model";
import cookieParser from "cookie-parser";


const mongoose = require("mongoose");
const cors = require("cors");

const { Role } = require("./models/role.model.ts");
require("dotenv").config();

const app = express();
const allowedOrigins: string[] = [
  "http://localhost:5173",
  "https://vincensiu.com",
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
const jwt = require("jsonwebtoken");

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
  .catch((error: Error) => {
    console.error("connection to server failed");
    console.error(error);
  });

  /** CLINICIANS */

//#region  Clinicians
// Post new clinician
app.post("/api/clinician", authenticateToken,checkRolesPermission(8228,8803), async (req, res) => {
  try {
    await Clinician.create(req.body);
    res.status(201).send({message: "data created in DB"});
  } catch (error) {
    res.status(400).send({message: error});
    console.error("ERROR ", error);
  }
});

// Retrieve all clinicans
app.get("/api/clinicians", async (req, res) => {
  try {
    //  const clinicians = await Clinician.find({}).lean<IClinician[]>();
    const clinicians = await Clinician.find()
      .sort({ titleID: 1 })
      .populate("titleID")
      .lean();

    const formatted = clinicians.map((c) => ({
      ID: c.ID,
      name: c.name,
      title: (c.titleID as any).name, // cast to access title name
      description: c.description,
      image: c.image,
      titleID: (c.titleID as any)._id
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(400).send({message: error});
    console.error("ERROR ", error);
  }
});

//Retrieve clinician by id
app.get("/api/clinician/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const clinician = await Clinician.findById(id);
    res.status(200).json(clinician);
  } catch (error) {
    console.error("ERROR ", error);
  }
});

//Retrieve clinician bookings - authtoken disabled
app.get("/api/appointments/:clinicianID", async (req, res) => {
  try {
    const { clinicianID } = req.params;
    const appointments = await Appointment.find({ clinicianID });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("ERROR ", error);
  }
});

//Edit clinician
app.put("/api/clinician/:id",authenticateToken,checkRolesPermission(8228,8803), async (req, res) => {
  try {
    const { id } = req.params;
    const {clinicianObj} = req.body;
    const updatedClinician = await Clinician.findByIdAndUpdate(
      id,
      { $set: clinicianObj },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedClinician);
  } catch (error) {
    console.error("Error",error);
  }
});

//#endregion

  /** USERS */

//create user
app.post("/api/user", async (req, res) => {
  try {
    const { password, mobileNumber, name, roleID } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    if (mobileNumber.length < 10 && mobileNumber.startsWith("04")) {
      throw new Error("Mobile number should be 10 digits and starts with 04");
    }

    const exisitingUser = await User.findOne({ mobileNumber });

    if (exisitingUser) {
      throw new Error(
        "You have an existing account with us, please login instead"
      );
    }

    const LegitRoles = await Role.findOne({ ID: roleID });

    if (LegitRoles) {
      const newUser = { roleID, password: hashedPassword, name, mobileNumber };
      await User.create(newUser);
      res.status(201).send("New user created");
    } else {
      throw new Error("Invalid Role");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("ERROR: " + error);
  }
});

// login
app.post("/api/login", async (req, res) => {
  try {
    const { password, mobileNumber } = req.body;

    if (mobileNumber.length < 10 && mobileNumber.startsWith("04")) {
      throw new Error(
        "Please check your mobile number, it should be 10 digits and starts with 04"
      );
    }

    const user = await User.findOne({ mobileNumber });

    if (!user) {
      throw new Error("Mobile number not found, please create a new account");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Password does not match");
    }

    const userObj = { name: user.name, mobileNumber: user.mobileNumber, roleID: user.roleID };

    const accessToken = jwt.sign(userObj, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(userObj, process.env.REFRESH_TOKEN_SECRET);
    // res.json({ accessToken, refreshToken });
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/refresh", // Only send this cookie to /refresh endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ status: 200, userObj })
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

app.get(
  "/api/adminonly",
  authenticateToken,
  checkRolesPermission(8228,8803),
  async (req, res) => {
    res.status(200).send({message: "You have access to this admin-only route."});
  }
);

app.get(
  "/api/titles",
  async (req, res) => {
    try {
      const titles = await Title.find();
      const modifiedTitles = titles.map(({_id,name}) => ({"ID": _id, name}))
      .filter(item => item.ID !== 11);
      res.status(200).json(modifiedTitles);

    } catch (error) {
      console.error(error);
      res.status(500).send({message: "Unable to retrieve titles"});
    }

  }
);

app.put("/api/role", async (req, res) => {
  try {
    const { ID } = req.body;
    const clinician = await Clinician.findOne({ ID });
    // await Clinician.update(req.body);
    res.status(201).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// app.post('/token', (req, res) => {
//   const refreshToken = req.body.token
//   if(!refreshToken) return res.sendStatus(401);

// })

//token authentication middleware

interface CustomRequest extends Request {
  user?: User;
}

interface User {
  phoneNumber: string;
  name: string;
  roleID: number;
}

function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // const authHeader = req.cookies.accessToken; 
    // const token = authHeader && authHeader.split(" ")[1];
    const token = req.cookies.accessToken;
    if (!token) {
      res.sendStatus(401);
      return;
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: Error | null, user: any) => {
        if (err) {
          console.error(err);
          res.sendStatus(403);
          return;
        }
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error(error);
  }
}

function checkRolesPermission(...allowedRoles: (number)[]) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.roleID || 0;

      if (!userRole) {
        res.status(403).json({ message: "No role found" });
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        console.log(allowedRoles);
        console.log(userRole);
        res.status(403).json({ message: "Access denied" });
        return;
      }

      next();
    } catch (error) {
      console.error("Error in authorizeRoles middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}


// function generateToken() {}

// create title
app.post("/api/title", async (req, res) => {
  try {
    await Title.create(req.body);
    res.status(201).send("New Title Created");
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.put("/api/appointments", async (req,res) => {
  try {
    const appointmentDTO = req.body;
    console.log(req.body);

    await Appointment.create(appointmentDTO);
    res.status(201).send("New Title Created");
    
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }

})