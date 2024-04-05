const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const axios = require("axios");

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://root:root@cluster0.jbpeevr.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopoLogy: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port " + port + " ");
});

const User = require("./models/user");
const Artisan = require("./models/artisan");
const Annonce = require("./models/announce");
const Report = require("./models/report");
const AnnounceArtisan = require("./models/announceArtisan");
const Service = require("./models/service");
const Review = require("./models/review");

app.post("/register", async (req, res) => {
  try {
    const { phoneNumber, name, password, city, adresse } = req.body;

    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      console.log("User is already registered");
      return res.status(400).json({ message: "This User already registered" });
    }

    const newUser = new User({
      phoneNumber,
      name,
      password,
      city,
      adresse,
    });

    await newUser.save();
    res.status(202).json({ message: "Registration successful" });
  } catch (error) {
    console.log("Error registering User", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};
const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check user existence in the database
    const user = await User.findOne({ phoneNumber });

    // Log the received user object after awaiting the asynchronous operation
    console.log("Received user object:", user);

    if (!user) {
      return res.status(500).json({ message: "Invalid user!" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    
    res.status(200).json({ token });
    
  } catch (error) {
    console.log("Error logging in user", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(404).json({ message: "Error getting profile information" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    
    res.status(200).json({ services });
  } catch (error) {
    console.log("Error fetching services", error);
    res.status(500).json({ message: "Error fetching  services" });
  }
});
