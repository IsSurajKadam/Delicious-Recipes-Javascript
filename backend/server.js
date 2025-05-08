import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js"
import RecipeRoutes from "./routes/RecipeRoutes.js"
import GamificationRoutes from "./routes/GamificationRoutes.js";
import AIRoutes from "./routes/AIRoutes.js";
import {scheduleChallenges} from "./services/challengeScheduler.js"
dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.use("/api/recipes",RecipeRoutes);
app.use("/api/gamification",GamificationRoutes);
app.use("/api",AIRoutes);
scheduleChallenges();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
