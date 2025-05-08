

document.getElementById("mobileMenu").addEventListener("click", () => {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
});
const fetchRecipes = async (category = "") => {
  const recipeCards = document.getElementById("recipeCards");
  recipeCards.innerHTML = `<p>Loading recipes...</p>`;

  try {
    
    const API_KEY = "Your_Key";
    const endpoint = category
      ? `https://api.spoonacular.com/recipes/complexSearch?type=${category}&apiKey=${API_KEY}`
      : `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();

  
    recipeCards.innerHTML = "";

  
    if (data.results && data.results.length > 0) {
      data.results.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "recipe-card";

        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}">
          <h3>${recipe.title}</h3>
          <p>Category: ${category || "Various"}</p>
          <button onclick="window.location.href='../Template/recipe-detail.html?id=${recipe.id}'">
            View Recipe
          </button>
        `;

        recipeCards.appendChild(card);
      });
    } else {
      recipeCards.innerHTML = `<p>No recipes found for this category.</p>`;
    }
  } catch (error) {
    recipeCards.innerHTML = `<p>Error loading recipes. Please try again.</p>`;
  }
};


const categoryLinks = document.querySelectorAll(".category-list li a");
categoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const category = event.target.dataset.category;
    fetchRecipes(category);
  });
});


fetchRecipes();
