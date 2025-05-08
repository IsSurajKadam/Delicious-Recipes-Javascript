const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:5500/api/recipes/all');
    const recipes = await response.json();
    const recipeContainer = document.getElementById('recipe-cards');

    if(recipes.length> 0)
    {

    recipeContainer.innerHTML = recipes.map(recipe => `
      <div class="recipe-card" id="recipe-${recipe.id}">
        <i class="fa-solid fa-bookmark icon" onclick="saveRecipe('${recipe.id}')"></i>
        <img src="${recipe.imageUrl}" alt="${recipe.title}">
        <h3>${recipe.title}</h3>
        <p>Category: ${recipe.category}</p>
        <p>Views <i class="fa-regular fa-eye"></i>: ${recipe.views}</p>
        <p>Likes: <span id="likes-${recipe.id}">${recipe.likes}</span></p>
        <button onclick="viewRecipe('${recipe.id}')">View Recipe</button>
        <button onclick="likeRecipe('${recipe.id}')">Like <i class="fa-solid fa-thumbs-up"></i></button>
        
        <button onclick="postReview('${recipe.id}')" style="width:90%;">Review</button>

        
      </div>
    `).join('');
    }
    else
    {
      recipeContainer.innerHTML="<h2 class='no-data'>No Recipe found</h2>"
    }
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
  }
}

async function viewRecipe(id) {

const token = localStorage.getItem("authToken");

if (!token) {
alert("You need to log in to view recipes!");
return;
}
  try {
    console.log(id)

    await fetch(`http://localhost:5500/api/recipes/${id}/view`, { method: 'POST',   headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },});
   
    window.location.href = `../Template/Browse.detail.html?id=${id}`;
  } catch (error) {
    console.error('Failed to increment views:', error);
  }
}

async function likeRecipe(id) {

  const token = localStorage.getItem("authToken");

if (!token) {
alert("You need to log in to like recipes!");
return;
}
  try {
    const response = await fetch(`http://localhost:5500/api/recipes/${id}/like`, { method: 'POST',
    headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
     });
    if (response.ok) {
      const updatedLikes = await response.json();
      document.getElementById(`likes-${id}`).textContent = updatedLikes.likes;
    } else {
      throw new Error('Failed to like recipe');
    }
  } catch (error) {
    console.error('Failed to like recipe:', error);
  }
}

function postReview(id)
{
  
window.location.href = `../Template/postReview.html?id=${id}`;
}

async function saveRecipe(recipeId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to save recipes!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:5500/api/recipes/${recipeId}/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Recipe saved for later!');
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
}

fetchRecipes();