import mongoose from "mongoose";

const attendlySchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  attendance: {
    type: Map,
    of: Number, // This can store attendance counts or percentages per subject
    default: {},
  },
});

const Attendly = mongoose.models.users || mongoose.model("attendly", attendlySchema);

export default Attendly;
