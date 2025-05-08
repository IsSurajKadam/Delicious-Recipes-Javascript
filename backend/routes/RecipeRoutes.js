import express from "express"
import {authenticateJWT} from "../middleware/authMiddleware.js"
import {upload} from "../config/cloudinary.js"
import {createRecipe,
  getRecipes,getRecipeById,
  updateRecipe,
  deleteRecipe,addReview,getRecipeReviews,
getReviewsByUser,viewRecipe,likeRecipe,saveRecipe,getSavedRecipes,unsaveRecipe,
deleteReview} from "../controllers/recipeController.js"

const router = express.Router();

router.post("/upload",authenticateJWT,upload.single("image"),createRecipe)
router.get("/all",getRecipes)
router.get("/:id",getRecipeById)
router.put("/:id",authenticateJWT,updateRecipe)
router.delete("/:id",authenticateJWT,deleteRecipe)
router.post("/:id/reviews",authenticateJWT,addReview)
router.get("/:id/reviews",getRecipeReviews)
router.get("/reviews/user/:userId",getReviewsByUser)
router.post("/:id/view",authenticateJWT,viewRecipe)
router.post("/:id/like",authenticateJWT,likeRecipe)
router.post("/:id/save",authenticateJWT,saveRecipe)
router.get("/users/saved",authenticateJWT,getSavedRecipes)
router.delete("/:id/unsave",authenticateJWT,unsaveRecipe)
router.delete("/reviews/:id",authenticateJWT,deleteReview)

export default router;