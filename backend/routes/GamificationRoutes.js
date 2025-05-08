import express from "express"
import {authenticateJWT} from "../middleware/authMiddleware.js"
import {getGamification,getLeaderboard,getUserChallenges,completeChallenge} from "../controllers/gamificationController.js"
const router = express.Router();

router.get("/rewards",authenticateJWT,getGamification)
router.get("/Leaderboard",getLeaderboard)
router.get("/challenges",authenticateJWT,getUserChallenges)
router.post("/challenges/complete/:id",authenticateJWT,completeChallenge)

export default router;