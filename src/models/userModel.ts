import mongoose from "mongoose";

// Define the schema
const attendlySchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // This creates a unique index on the email field
    lowercase: true, // Automatically lowercases the email to handle case-insensitivity
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  attendance: {
    type: Map,
    of: Number, // Store attendance counts or percentages per subject
    default: {},
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create or use the existing model
const Attendly = mongoose.models.Attendly || mongoose.model("Attendly", attendlySchema);

export default Attendly;
