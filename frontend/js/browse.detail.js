const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const fetchRelatedVideo = async (recipeTitle, apiKey) => {
  const videoFrame = document.getElementById("relatedVideo");
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        recipeTitle
      )}&type=video&videoDuration=long&maxResults=1&key=${apiKey}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      videoFrame.src = `https://www.youtube.com/embed/${videoId}`;
    } else {
      videoFrame.parentElement.innerHTML = `<p>No related video found.</p>`;
    }
  } catch (error) {
    videoFrame.parentElement.innerHTML = `<p>Error fetching video. Please try again later.</p>`;
    console.error("Error fetching video:", error);
  }
};


async function fetchRecipeDetailsFromDatabase() {
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  console.log(id)

  try {
    
    const YOUTUBE_API_KEY = "AIzaSyAiRMT04P7M4GthoqvB68sgzOC_fdZsRvU";
    const response = await fetch(`http://localhost:5500/api/recipes/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }
    const data = await response.json();

    
    const recipeTitle = document.querySelector("#recipeTitle");
    const recipeImage = document.querySelector("#recipeImage");
    const recipeCategory = document.querySelector("#recipeCategory");
    const ingredientsList = document.querySelector("#ingredientsList");
    const instructions = document.querySelector("#instructions");
    const videoFrame = document.getElementById("relatedVideo");

    
    if (data) {
     
      recipeTitle.textContent = data.title || "Recipe Title not available";
      
      
      recipeImage.src = data.imageUrl || "";
      recipeImage.alt = data.title || "Recipe Image";

     
      recipeCategory.textContent = `Category: ${data.category || "N/A"}`;

      
      if (ingredientsList && Array.isArray(data.ingredients)) {
        ingredientsList.innerHTML = data.ingredients
          .map((ingredient) => `<li>${ingredient}</li>`)
          .join("");
      } else {
        ingredientsList.innerHTML = "<li>No ingredients available</li>";
      }

      
      instructions.textContent = data.instructions || "No instructions available.";
      fetchRelatedVideo(data.title, YOUTUBE_API_KEY);
    } else {
      
      recipeTitle.textContent = "Recipe not found.";
      ingredientsList.innerHTML = "<li>No ingredients available</li>";
      instructions.textContent = "No instructions available.";
    }
  } catch (err) {
    console.error(err);
  }
}

function renderStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

async function fetchReviewAndRatings()
{
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
try{
  const reviewResponse = await fetch(`http://localhost:5500/api/recipes/${id}/reviews`);
    if (!reviewResponse.ok) throw new Error("Failed to fetch reviews");
    const reviews = await reviewResponse.json();
    console.log(reviews)

   
    const averageRating =
      reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : "No ratings yet";

    document.querySelector("#averageRating").textContent = `Average Rating: ${averageRating}`;

   
    const reviewsList = document.querySelector("#reviewsList");
    if (reviews.length > 0) {
      reviewsList.innerHTML = reviews
        .map(
          (review) => `
          <div class="review-card">
            <img src="${review.reviewedBy.ProfilePhotoUrl || "/frontend/images/download.jpeg"}" alt="${review.reviewedBy.username}" />
            <div class="review-content">
              <h4>${review.reviewedBy.username}</h4>
              <div class="stars">${renderStars(review.rating)}</div>
              <p>${review.comment}</p>
            </div>
          </div>`
        )
        .join("");
    } else {
      reviewsList.innerHTML = "<p>No reviews available.</p>";
    }
  } catch (error) {
    console.error("Error fetching recipe details and reviews:", error);
    document.querySelector("#reviewsSection").innerHTML = "<p>Error loading reviews. Please try again later.</p>";
  }
}


document.addEventListener("DOMContentLoaded",()=>
{
  fetchRecipeDetailsFromDatabase(),
  fetchReviewAndRatings()
});
