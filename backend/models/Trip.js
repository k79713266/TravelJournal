const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    story: {
      type: String,
      required: true,
    },

    expense: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      required: true,
    },
    photos: {
  type: [String],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);