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

const User = require("./models/users");
const Artisan = require("./models/artisans");
const Annonce = require("./models/announce");
const Report = require("./models/reports");
const AnnounceArtisan = require("./models/announceArtisan");
const Service = require("./models/services");
const Review = require("./models/reviews");
const ServiceRequest = require("./models/serviceRequests");


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






// POST /api/reports - Create a new report for user ?
app.post("/reports", async (req, res) => {
  try {
    const { userId, artisanId, serviceId, title, issues, description } = req.body;
    // Validate input
    if (!title || !issues || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check that the artisan is valid
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    
    const newReport = new Report({
      user: userId,
      artisan: artisanId,
      service: serviceId,
      title: title,
      issues : issues,
      description : description,
      reportDate: new Date(),

    });
     
    await newReport.save();
    
  
    user.reports.push(newReport._id);
    artisan.reportsReceived.push(newReport._id);
    
    await user.save();
    await artisan.save();

    res.status(201).json({ message: "Report created successfully" });
  } catch (error) {
    console.log("Error creating report", error);
    res.status(500).json({ message: "Error creating report" });
  }
});

// GET /api/reports/:userId - Get all reports for a user
app.get("/reports/:userId", async (req, res) => {
  const {userId} = req.params;
  
  try {
    const reports = await Report.find({ user: userId })
    .populate('artisan')
    .populate('service')
    .populate('user');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// GET /api/reports/:reportId - Get a report by ID
app.get("/reports/:reportId", async (req, res) => {
  const reportId = req.params.reportId;
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ report });
  } catch (error) {
    console.log("Error fetching report", error);
    res.status(500).json({ message: "Error fetching report" });
  }
});

// PUT /api/reports/:reportId - Update a report by ID
app.put("/reports/:reportId", async (req, res) => {
  const reportId = req.params.reportId;
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    report.status = req.body.status;
    await report.save();
    res.status(200).json({ message: "Report updated successfully" });
  } catch (error) {
    console.log("Error updating report", error);
    res.status(500).json({ message: "Error updating report" });
  }
});

// DELETE /api/reports/:reportId - Delete a report by ID
app.delete("/reports/:reportId", async (req, res) => {
  const reportId = req.params.reportId;
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    await report.remove();
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.log("Error deleting report", error);
    res.status(500).json({ message: "Error deleting report" });
  }
});

// POST /api/announce - Create a new announce post for all users to see
app.post("/announce", async (req, res) => {
  try {
    const { serviceId, userId, description, media, priceGiven, extraNote } = req.body;
    // Validate input
    if (!serviceId || !userId || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check that the user exists and is verified
    const user = await User.findOne({ _id: userId });
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Unauthorized user" });
    } 

    const newAnnounce = new Annonce({
      service: serviceId,
      user: userId,
      description: description,
      media: media,
      priceGiven: priceGiven,
      extraNote: extraNote,
      createdAt: new Date(),
    });
 
    await newAnnounce.save();
     
   
    user.announces.push(newAnnounce._id); // Add the id of the new announcement to the user's announces array
    await user.save();
    
    res.status(201).json({ message: "Announce created successfully" });
  } catch (error) {
    console.log("Error creating announce", error);
    res.status(500).json({ message: "Error creating announce" });
  }
});
 // GET /api/announces - Get all announces from the database
 app.get('/announces', async (req, res) => {
  try {
    const announces = await Annonce.find( );
    res.status(200).json({ announces });
  } catch (error) {
    console.log('Error fetching announces', error);
    res.status(500).json({ message: 'Error fetching announces' });
  } 
});

// GET /api/announces/:userId - Get all announces for a user
app.get('/announces/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const announces = await Annonce.find({ user: userId });
    res.status(200).json({ announces });
  } catch (error) {
    console.log('Error fetching announces', error);
    res.status(500).json({ message: 'Error fetching announces' });
  }
});

// GET /api/announces/:announceId - Get an announce by ID
app.get('/announces/:announceId', async (req, res) => {
  const announceId = req.params.announceId;
  try {
    const announce = await Annonce.findById(announceId);
    if (!announce) {
      return res.status(404).json({ message: 'Announce not found' });
    }
    res.status(200).json({ announce });
  } catch (error) {
    console.log('Error fetching announce', error);
    res.status(500).json({ message: 'Error fetching announce' });
  }
});

// PUT /api/announce/:announceId - Update an announce by ID
app.put('/announces/:announceId', async (req, res) => {
  const announceId = req.params.announceId;
  try {
    const announce = await Annonce.findById(announceId);
    if (!announce) {
      return res.status(404).json({ message: 'Announce not found' });
    }
    announce.status = req.body.status;
    await announce.save();
    res.status(200).json({ message: 'Announce updated successfully' });
  } catch (error) {
    console.log('Error updating announce', error);
    res.status(500).json({ message: 'Error updating announce' });
  }
});

// POST /api/announces-artisan - Create a new artisan announc respond to the user announce
app.post('/announces-artisan', async (req, res) => {
  try {
    const {artisanId, announceId, priceOffered,description,media } = req.body;
    const userId = req.userId;
    
    // Check that this is a valid user and artisan
    const user = await User.findById(userId);
    if(!user || !user.isArtisan) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const artisan = await Artisan.findById(artisanId);
     
    if (!artisan) {
      return res.status(400).json({ message: 'Artisan not found' });
    }
    const announce = await Annonce.findById(announceId);
    if(!announce){
        return res.status(400).json({ message: 'Announce not found' });
    }

    
    const newAnnounceArtisan = new AnnounceArtisan({
      artisan: artisanId,
      userAnnounce: announceId,
      priceOffered: priceOffered,
      description: description,
      media: media,
      respondDate: new Date(),
    });
    await newAnnounceArtisan.save(); 

    user.receivedAnnounces.push(newAnnounceArtisan._id);
    artisan.sentAnnounce.push(newAnnounceArtisan._id);

    await Promise.all([user.save(), artisan.save()]);
    await user.save();

    //const userAnnounce = await Annonce.findById(announceId);
    // userAnnounce.numberResponds += 1;
    //userAnnounce.lastInteraction = new Date();
    //await userAnnounce.save();
    
    res.status(201).json({ message: 'Announce artisan created successfully' });
  } catch (err) {
    console.log('Error creating announce artisan', err);
    res.status(500).json({ message: 'Error creating announce artisan' });
  }
});

// POST /api/service-request - Create a new service request
app.post("/service-request", async (req, res) => {
  try {
    const { serviceId, artisanId, price } = req.body;
    const userId = req.userId;
    const announceId = req.announceId;
     
    // Check that the user exists and is authenticated
    const user = await User.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    // Check if the artisan exists
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(400).json({ message: "Artisan not found" });
    }
    // Check if the service exists 
    const service = await Service.findById(serviceId);
    if(!service){
        return res.status(400).json({ message: 'Service not found' });
    }
    // Check if the price is valid of the service 
    if(price < service.minPrice || price > service.maxPrice){
        return res.status(400).json({ message: 'Price is not valid' });
    }
         

    //const announceArtisanId = req.announceArtisanId;
    const newServiceRequest = new ServiceRequest({
      user: userId,
      service: serviceId,
      artisan: artisanId,
      price: price,
      requestDate: new Date(),
    });

    const announce = await Annonce.findById(userId);
    const announceArtisan = await AnnounceArtisan.findById({
      userAnnounce: announceId,
      artisan: artisanId,
    });
     
    if (announce.status === "Accepted" && announceArtisan.status === "Accepted") {
      await newServiceRequest.save();

      const user = await User.findById(userId);
      const artisan = await Artisan.findById(artisanId);
      user.serviceRequests.push(newServiceRequest._id);
      artisan.serviceRequests.push(newServiceRequest._id);
      await user.save();
      await artisan.save();

      res.status(201).json({ message: "Service request created successfully" });
    } else {
      res.status(400).json({ message: "Announce or AnnounceArtisan is not accepted" });
    }
  } catch (error) {
    console.log("Error creating service request", error);
    res.status(500).json({ message: "Error creating service request" });
  }
});

// GET /api/service-request/:userId - Get all service requests for a user
app.get("/service-request/:userId", async (req, res) => {
  
  const { userId } = req.params;
  try {
    
     
    const serviceRequests = await ServiceRequest.find({ user: userId })
    .populate('user')
    .populate('artisan')
    .populate('service'); 
    
    if (!serviceRequests || serviceRequests.length === 0) {
      
      return res.status(404).json({ message: "No service requests found" });
    }
    
    
    res.status(200).json({ serviceRequests });
    
  } catch (error) {
    console.log("Error getting service requests", error);
    res.status(500).json({ message: "Error getting service requests", error});
  }
});

// GET /api/service-request/:serviceRequestId - Get a service request by ID
app.get("/service-request/:serviceRequestId",  async (req, res) => {
  const serviceRequestId = req.params.serviceRequestId;
  try {
    const serviceRequests = await ServiceRequest.find({ serviceRequestId });
    res.status(200).json({ serviceRequests });
  } catch (error) {
    console.log("Error fetching service request", error);
    res.status(500).json({ message: "Error fetching service request" });
  }
});

// PUT /api/service-request/:serviceRequestId - Update a service request by ID
app.put("/service-request/:serviceRequestId",  async (req, res) => {
  const serviceRequestId = req.params.serviceRequestId;
  try {
    const serviceRequest = await ServiceRequest.findById({ serviceRequestId });
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    serviceRequest.status = req.body.status;
    await serviceRequest.save();
    res.status(200).json({ message: "Service request updated successfully" });
  } catch (error) {
    console.log("Error updating service request", error);
    res.status(500).json({ message: "Error updating service request" });
  }
});

// DELETE /api/service-request/:serviceRequestId - Delete a service request by ID
app.delete("/service-request/:serviceRequestId",  async (req, res) => {
  const serviceRequestId = req.params.serviceRequestId;
  try {
    const serviceRequest = await ServiceRequest.findById({ serviceRequestId });
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
    await serviceRequest.remove();
    res.status(200).json({ message: "Service request deleted successfully" });
  } catch (error) {
    console.log("Error deleting service request", error);
    res.status(500).json({ message: "Error deleting service request" });
  }
});