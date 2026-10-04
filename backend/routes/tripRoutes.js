const express = require("express");
const Trip = require("../models/Trip");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, path.join(__dirname, "../uploads"));
},

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add Trip
router.post("/add", upload.array("photos", 10), async (req, res) => {
  try {
   const {
  userId,
  destination,
  startDate,
  endDate,
  story,
  expense,
  rating,
} = req.body;

const photos = req.files
  ? req.files.map((file) => `/uploads/${file.filename}`)
  : [];

    const trip = new Trip({
      userId,
      destination,
      startDate,
      endDate,
      story,
      expense,
      rating,
      photos,
    });

    await trip.save();

    res.status(201).json({
      message: "Trip added successfully",
      trip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add trip",
    });
  }
});

// Get all trips of a user
router.get("/:userId", async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(trips);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch trips",
    });
  }
});

// Delete Trip
router.delete("/:id", async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);

    res.json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete trip",
    });
  }
});

// Update Trip
router.put("/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update trip",
    });
  }
});

module.exports = router;