import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  target: { type: Number, required: true },
  type: { type: String, enum: ["upload", "review", "save", "like"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
