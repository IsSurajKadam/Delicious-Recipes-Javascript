import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["viewer", "uploader"], default: "viewer" },
  ProfilePhotoUrl: { type: String, default: "" },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  points: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  recipesViewed: { type: Number, default: 0 },
  recipesUploaded: { type: Number, default: 0 },
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    default: [],
  }],
  fetchedChallenges: [{
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    endDate: { type: Date },
  }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
