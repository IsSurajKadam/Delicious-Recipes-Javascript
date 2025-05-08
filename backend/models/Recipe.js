import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: String,
  category: String,
  imageUrl: String,
  ingredients: [String],
  instructions: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviews: [
    {
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: String,
    }
  ],
  averageRating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
