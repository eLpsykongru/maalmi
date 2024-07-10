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
// PUT /api/profile/:userId - Update a user profile by ID
app.put("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.name = req.body.name;
    user.phoneNumber = req.body.phoneNumber;
    user.city = req.body.city;
    user.adresse = req.body.adresse;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error updating profile", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});
// DELETE /api/profile/:userId - Delete a user by ID
app.delete("/profile/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await user.remove();
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log("Error deleting profile", error);
    res.status(500).json({ message: "Error deleting profile" });
  }
});


//  GET /api/services - Get all services from the database
app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    
    res.status(200).json({ services });
  } catch (error) {
    console.log("Error fetching services", error);
    res.status(500).json({ message: "Error fetching  services" });
  }
});
// GET /api/services/:serviceId - Get a service by ID
app.get("/services/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.log("Error fetching service", error);
    res.status(500).json({ message: "Error fetching service" });
  }
});
// GET /api/services/:serviceName - Get a service by name
app.get("/services/:serviceName", async (req, res) => {
  const serviceName = req.params.serviceName;
  try {
    const service = await Service.findOne({ name: serviceName });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.log("Error fetching service", error);
    res.status(500).json({ message: "Error fetching service" });
  }
});
// GET /api/services/:serviceId/artisans - Get all artisans offering a service
app.get("/services/:serviceId/artisans", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const artisans = await Artisan.find({ services: serviceId });
    if (!artisans || artisans.length === 0) {
      return res.status(404).json({ message: "No artisans found for this service" });
    }
    res.status(200).json({ artisans });
  } catch (error) {
    console.log("Error fetching artisans for this service", error);
    res.status(500).json({ message: "Error fetching artisans for this service" });
  }
});
// GET /api/services/:serviceId/reviews - Get all reviews for a service
app.get("/services/:serviceId/reviews", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const reviews = await Review.find({ service: serviceId });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this service" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews for this service", error);
    res.status(500).json({ message: "Error fetching reviews for this service" });
  }
});
// GET /api/services/:serviceId/reviews/:userId - Get all reviews for a service by a user
app.get("/services/:serviceId/reviews/:userId", async (req, res) => {
  const { serviceId, userId } = req.params;
  try {
    const reviews = await Review.find({ service: serviceId, user: userId });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews for this user", error);
    res.status(500).json({ message: "Error fetching reviews for this user" });
  }
});
// GET /api/services/:serviceId/reviews/:reviewId - Get a review by ID
app.get("/services/:serviceId/reviews/:reviewId", async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ review });
  } catch (error) {
    console.log("Error fetching review", error);
    res.status(500).json({ message: "Error fetching review" });
  }
});
// post add artisan to a service
app.post("/services/:serviceId/add-artisan", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const { artisanId } = req.body;
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    service.artisans.push(artisanId);
    await service.save();
    res.status(200).json({ message: "Artisan added to service successfully" });
  } catch (error) {
    console.log("Error adding artisan to service", error);
    res.status(500).json({ message: "Error adding artisan to service" });
  }
});
// post add review to a service
app.post("/services/:serviceId/add-review", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const { userId, title, content, rating, recomended } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newReview = new Review({
      user: userId,
      service: serviceId,
      title,
      content,
      rating,
      recomended,
    });
    await newReview.save();
    service.reviews.push(newReview._id);
    await service.save();
    res.status(201).json({ message: "Review added to service successfully" });
  } catch (error) {
    console.log("Error adding review to service", error);
    res.status(500).json({ message: "Error adding review to service" });
  }
});
 
// POST /api/services - Create a new service
app.post("/services", async (req, res) => {
  try {
    const { name, description, minPrice, maxPrice } = req.body;
    if (!name || !description || !minPrice || !maxPrice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newService = new Service({
      name,
      description,
      minPrice,
      maxPrice,
    });
    await newService.save();
    res.status(201).json({ message: "Service created successfully" });
  } catch (error) {
    console.log("Error creating service", error);
    res.status(500).json({ message: "Error creating service" });
  }
});
// PUT /api/services/:serviceId - Update a service by ID
app.put("/services/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    service.name = req.body.name;
    service.description = req.body.description;
    service.minPrice = req.body.minPrice;
    service.maxPrice = req.body.maxPrice;
    await service.save();
    res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    console.log("Error updating service", error);
    res.status(500).json({ message: "Error updating service" });
  }
});
//
// DELETE /api/services/:serviceId - Delete a service by ID
app.delete("/services/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    await service.remove();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.log("Error deleting service", error);
    res.status(500).json({ message: "Error deleting service" });
  }
});
// DELETE /api/services/:serviceId/artisans/:artisanId - Remove an artisan from a service
app.delete("/services/:serviceId/artisans/:artisanId", async (req, res) => {
  const { serviceId, artisanId } = req.params;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    service.artisans = service.artisans.filter((id) => id !== artisanId);
    await service.save();
    res.status(200).json({ message: "Artisan removed from service successfully" });
  } catch (error) {
    console.log("Error removing artisan from service", error);
    res.status(500).json({ message: "Error removing artisan from service" });
  }
});
// DELETE /api/services/:serviceId/reviews/:reviewId - Remove a review from a service
app.delete("/services/:serviceId/reviews/:reviewId", async (req, res) => {
  const { serviceId, reviewId } = req.params;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    service.reviews = service.reviews.filter((id) => id !== reviewId);
    await service.save();
    res.status(200).json({ message: "Review removed from service successfully" });
  } catch (error) {
    console.log("Error removing review from service", error);
    res.status(500).json({ message: "Error removing review from service" });
  }
});

//  POST /api/artisans - Create a new artisan
app.post("/artisans", async (req, res) => {
  try {
    const { name, phoneNumber, city, adresse, serviceIds } = req.body;
    if (!name || !phoneNumber || !city || !adresse || !serviceIds) {
      return res.status(400).json({ message: "All fields are required" });
    }
     
    const newArtisan = new Artisan({
      name,
      phoneNumber,
      city,
      adresse,
      services: serviceIds,
    });
    await newArtisan.save();
    res.status(201).json({ message: "Artisan created successfully" });
  } catch (error) {
    console.log("Error creating artisan", error);
    res.status(500).json({ message: "Error creating artisan" });
  }
} );
// GET /api/artisans - Get all artisans from the database
app.get("/artisans", async (req, res) => {
  try {
    const artisans = await Artisan.find();
    res.status(200).json({ artisans });
  } catch (error) {
    console.log("Error fetching artisans", error);
    res.status(500).json({ message: "Error fetching artisans" });
  }
});
// GET /api/artisans/:artisanId - Get an artisan by ID
app.get("/artisans/:artisanId", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    res.status(200).json({ artisan });
  } catch (error) {
    console.log("Error fetching artisan", error);
    res.status(500).json({ message: "Error fetching artisan" });
  }
});

// GET /api/artisans/:artisanId/services - Get all services offered by an artisan
app.get("/artisans/:artisanId/services", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const services = await Service.find({ artisans: artisanId });
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this artisan" });
    }
    res.status(200).json({ services });
  } catch (error) {
    console.log("Error fetching services for this artisan", error);
    res.status(500).json({ message: "Error fetching services for this artisan" });
  }
});
// GET /api/artisans/:artisanId/reviews - Get all reviews for an artisan
app.get("/artisans/:artisanId/reviews", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const reviews = await Review.find({ artisan: artisanId });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this artisan" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews for this artisan", error);
    res.status(500).json({ message: "Error fetching reviews for this artisan" });
  }
});
// GET /api/artisans/:artisanId/reviews/:userId - Get all reviews for an artisan by a user
app.get("/artisans/:artisanId/reviews/:userId", async (req, res) => {
  const { artisanId, userId } = req.params;
  try {
    const reviews = await Review.find({ artisan: artisanId, user: userId });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this user" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("Error fetching reviews for this user", error);
    res.status(500).json({ message: "Error fetching reviews for this user" });
  }
});
// GET /api/artisans/:artisanId/reviews/:reviewId - Get a review by ID
app.get("/artisans/:artisanId/reviews/:reviewId", async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ review });
  } catch (error) {
    console.log("Error fetching review", error);
    res.status(500).json({ message: "Error fetching review" });
  }
});
// POST /api/artisans/:artisanId/add-service - Add a service to an artisan
app.post("/artisans/:artisanId/add-service", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    artisan.services.push(serviceId);
    await artisan.save();
    res.status(200).json({ message: "Service added to artisan successfully" });
  } catch (error) {
    console.log("Error adding service to artisan", error);
    res.status(500).json({ message: "Error adding service to artisan" });
  }
});
// POST /api/artisans/:artisanId/add-review - Add a review to an artisan
app.post("/artisans/:artisanId/add-review", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    const { userId, title, content, rating, recomended } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newReview = new Review({
      user: userId,
      artisan: artisanId,
      title,
      content,
      rating,
      recomended,
    });
    await newReview.save();
    artisan.reviews.push(newReview._id);
    await artisan.save();
    res.status(201).json({ message: "Review added to artisan successfully" });
  } catch (error) {
    console.log("Error adding review to artisan", error);
    res.status(500).json({ message: "Error adding review to artisan" });
  }
});
// PUT /api/artisans/:artisanId - Update an artisan by ID
app.put("/artisans/:artisanId", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    artisan.name = req.body.name;
    artisan.phoneNumber = req.body.phoneNumber;
    artisan.city = req.body.city;
    artisan.address = req.body.adresse;
    await artisan.save();
    res.status(200).json({ message: "Artisan updated successfully" });
  } catch (error) {
    console.log("Error updating artisan", error);
    res.status(500).json({ message: "Error updating artisan" });
  }
});
// DELETE /api/artisans/:artisanId - Delete an artisan by ID
app.delete("/artisans/:artisanId", async (req, res) => {
  const artisanId = req.params.artisanId;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    await artisan.remove();
    res.status(200).json({ message: "Artisan deleted successfully" });
  } catch (error) {
    console.log("Error deleting artisan", error);
    res.status(500).json({ message: "Error deleting artisan" });
  }
});
// DELETE /api/artisans/:artisanId/services/:serviceId - Remove a service from an artisan
app.delete("/artisans/:artisanId/services/:serviceId", async (req, res) => {
  const { artisanId, serviceId } = req.params;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    artisan.services = artisan.services.filter((id) => id !== serviceId);
    await artisan.save();
    res.status(200).json({ message: "Service removed from artisan successfully" });
  } catch (error) {
    console.log("Error removing service from artisan", error);
    res.status(500).json({ message: "Error removing service from artisan" });
  }
});
// DELETE /api/artisans/:artisanId/reviews/:reviewId - Remove a review from an artisan
app.delete("/artisans/:artisanId/reviews/:reviewId", async (req, res) => {
  const { artisanId, reviewId } = req.params;
  try {
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    artisan.reviews = artisan.reviews.filter((id) => id !== reviewId);
    await artisan.save();
    res.status(200).json({ message: "Review removed from artisan successfully" });
  } catch (error) {
    console.log("Error removing review from artisan", error);
    res.status(500).json({ message: "Error removing review from artisan" });
  }
});


// POST /api/reports - Create a new report for user ?
app.post("/reports", async (req, res) => {
  try {
    const { userId, artisanId, serviceId, title, issues, description, serviceRequestId } = req.body;
    // Validate input
    if (!title || !issues || !description ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check that the service request is valid
    const serviceRequest = await ServiceRequest.findById(serviceRequestId);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }
     
    const newReport = new Report({
      user: userId,
      artisan: artisanId,
      service: serviceId,
      title: title,
      issues : issues,
      description : description,
      reportDate: new Date(),
      serviceRequest: serviceRequestId,
    });
     
    await newReport.save();
    
    const user = await User.findById(userId);
    const artisan = await Artisan.findById(artisanId);
    
  
    user.reports.push(newReport._id);
    artisan.reportsReceived.push(newReport._id);
    serviceRequest.reports.push(newReport._id);
 
    await user.save();
    await artisan.save();
    await serviceRequest.save();

    res.status(201).json({ message: "Report created successfully" });
  } catch (error) {
    console.log("Error creating report", error);
    res.status(500).json({ message: "Error creating report" });
  }
});
// GET /api/reports - Get all reports from the database
app.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find()
    .populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});
// GET /api/reports/:artisanId - Get all reports for an artisan
app.get("/reports/artisan/:artisanId", async (req, res) => {
  const {artisanId} = req.params;
  
  try {
    const reports = await Report.find({ artisan: artisanId })
    .populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this artisan" });
    }
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports for this artisan", error);
    res.status(500).json({ message: "Error fetching reports for this artisan" });
  }
});
// GET /api/reports/:serviceId - Get all reports for a service
app.get("/reports/service/:serviceId", async (req, res) => {
  const {serviceId} = req.params;
  
  try {
    const reports = await Report.find({ service: serviceId })
    .populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this service" });
    }
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports for this service", error);
    res.status(500).json({ message: "Error fetching reports for this service" });
  }
});
//
// GET /api/reports/:userId - Get all reports for a user
app.get("/reports/user/:userId", async (req, res) => {
  const {userId} = req.params;
  
  try {
    
    const reports = await Report.find({ user: userId })
    
    .populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this user" });
    }
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports for this user", error);
    res.status(500).json({ message: "Error fetching reports for this user" });
  }
});

// GET /api/reports/:serviceRequestId - Get all reports for a service request
app.get("/reports/serviceRequest/:serviceRequestId", async (req, res) => {
  const {serviceRequestId} = req.params;
  
  try {
    const reports = await Report.find({ serviceRequest: serviceRequestId })
    .populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');
    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No reports found for this service request" });
    }
    res.status(200).json({ reports });
  } catch (error) {
    console.log("Error fetching reports this service request", error);
    res.status(500).json({ message: "Error fetching reports this service request" });
  }
});
//

// GET /api/reports/:reportId - Get a report by ID
app.get("/reports/:reportId", async (req, res) => {
  const reportId = req.params.reportId;
  try {
    const report = await Report.findById(reportId).populate('artisan')
    .populate('service')
    .populate('user')
    .populate('serviceRequest');;
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
app.get('/announces/user/:userId', async (req, res) => {
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
app.get("/service-request/user/:userId", async (req, res) => {
  
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

 