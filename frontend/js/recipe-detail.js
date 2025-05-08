
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");
console.log(recipeId)


const fetchRecipeDetails = async () => {
  const recipeTitle = document.getElementById("recipeTitle");
  const recipeImage = document.getElementById("recipeImage");
  const recipeCategory = document.getElementById("recipeCategory");
  const ingredientsList = document.getElementById("ingredientsList");
  const instructions = document.getElementById("instructions");
  const videoFrame = document.getElementById("relatedVideo");

  document.getElementById("mobileMenu").addEventListener("click", () => {
    const navLinks = document.getElementById("navLinks");
    navLinks.classList.toggle("show");
  });
  
  

  try {
    
    const SPOONACULAR_API_KEY = "Your_Key";
    const YOUTUBE_API_KEY = "Your_Key";

   
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    const data = await response.json();

    if (data) {
      
      recipeTitle.textContent = data.title;
      recipeImage.src = data.image;
      recipeImage.alt = data.title;
      recipeCategory.textContent = `Category: ${data.dishTypes.join(", ") || "N/A"}`;
      ingredientsList.innerHTML = data.extendedIngredients
        .map((ing) => `<li>${ing.original}</li>`)
        .join("");
      instructions.textContent = data.instructions || "No instructions available.";

      
      fetchRelatedVideo(data.title, YOUTUBE_API_KEY);
    } else {
      recipeTitle.textContent = "Recipe not found.";
    }
  } catch (error) {
    recipeTitle.textContent = "Error loading recipe details.";
    console.error("Error fetching recipe details:", error);
  }
};


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
fetchRecipeDetails();

