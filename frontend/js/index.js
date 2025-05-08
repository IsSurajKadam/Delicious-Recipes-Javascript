document.addEventListener('DOMContentLoaded', async () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');
  const logoutButton = document.querySelector('.logoutButton');
  const uploadButton = document.getElementById('uploadButton');
  const browseButton = document.getElementById('browseButton');
  const dashboardButton=document.getElementById("dashboardbutton");
  const profilecontainer=document.getElementById("profilecontainer");
  const viewerDashboard=document.getElementById("ViewerDashboard");
 

  
  const authToken = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  dashboardButton.style.display="none";
  

  if (authToken) {
    
    loginButton.style.display = 'none';
    signupButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
    logoutButton.style.backgroundColor='orange';

    
    if (userRole === 'uploader') {
      uploadButton.style.display = 'inline-block';
      browseButton.style.display = 'inline-block';
      dashboardButton.style.display='inline-block';
      profilecontainer.style.display='inline-block';
      viewerDashboard.style.display='none';
    } else if (userRole === 'viewer') {
       profilecontainer.style.display='inline-block'
      uploadButton.style.display = 'none'; 
      browseButton.style.display = 'inline-block'; 
      viewerDashboard.style.display='inline-block';
      
    }
  } else {
  
    loginButton.style.display = 'inline-block';
    signupButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
    uploadButton.style.display = 'none';
    browseButton.style.display = 'inline-block'; 
    viewerDashboard.style.display='inline-block';
  }

  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    alert("You are logout successfully")
    window.location.href = '../Template/index.html'; 
  });

  try{
    const profilePhoto=document.getElementById("profilePhoto");
    const response=await fetch("http://localhost:5500/api/users/user",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
    if (!response.ok) {
      throw new Error("Failed to fetch uploader details");
    }

    const data = await response.json();
    console.log(data.user)
    if(data.user.ProfilePhotoUrl)
    {
      profilePhoto.src=data.user.ProfilePhotoUrl
    }
    else
    {
      profilePhoto.src="/frontend/images/download.jpeg"
    }

  }
  catch (error) {
    console.error("Error fetching user data:", error);
   
  }
  
});

document.addEventListener("DOMContentLoaded", () => {
  const profilePhoto = document.getElementById("profilePhoto");
  const profileDropdown = document.getElementById("profileDropdown");

  
  profilePhoto.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("visible");
  });

  
  window.addEventListener("click", () => {
    if (profileDropdown.classList.contains("visible")) {
      profileDropdown.classList.remove("visible");
    }
  });
});


  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });


const fetchLatestRecipes = async () => {
  const latestRecipesContainer = document.getElementById("latestRecipesContainer");
  latestRecipesContainer.innerHTML = `<p>Loading latest recipes...</p>`;

  try {
    const API_KEY = "e1441a600f9f4dd0ab154613e02082b8";
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?number=8&sort=popularity&apiKey=${API_KEY}`
    );
    const data = await response.json();

    latestRecipesContainer.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach((recipe) => {
        const recipeCard = createRecipeCard(recipe);
        latestRecipesContainer.appendChild(recipeCard);
      });
    } else {
      latestRecipesContainer.innerHTML = `<p>No latest recipes found.</p>`;
    }
  } catch (error) {
    latestRecipesContainer.innerHTML = `<p>Error loading latest recipes. Please try again.</p>`;
    console.error("Error fetching latest recipes:", error);
  }
};


const searchRecipes = async (query) => {
  const latestRecipesContainer = document.getElementById("latestRecipesContainer");
  latestRecipesContainer.innerHTML = `<p>Searching recipes...</p>`;

  try {
    const API_KEY = "e1441a600f9f4dd0ab154613e02082b8";
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=8&apiKey=${API_KEY}`
    );
    const data = await response.json();

    latestRecipesContainer.innerHTML = "";

    if (data.results && data.results.length > 0) {
      data.results.forEach((recipe) => {
        const recipeCard = createRecipeCard(recipe);
        latestRecipesContainer.appendChild(recipeCard);
      });
    } else {
      latestRecipesContainer.innerHTML = `<p>No recipes found for "${query}".</p>`;
    }
  } catch (error) {
    latestRecipesContainer.innerHTML = `<p>Error searching recipes. Please try again.</p>`;
    console.error("Error searching recipes:", error);
  }
};


const createRecipeCard = (recipe) => {
  const recipeCard = document.createElement("div");
  recipeCard.className = "recipe-card";

  recipeCard.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}">
    <h3>${recipe.title}</h3>
    <button onclick="window.location.href='/Template/recipe-detail.html?id=${recipe.id}'">
      View Recipe
    </button>
  `;

  return recipeCard;
};


document.getElementById("searchInput").addEventListener("input", (event) => {
  const query = event.target.value.trim();
  if (query) {
    searchRecipes(query);
  } else {
    fetchLatestRecipes(); 
  }
});


fetchLatestRecipes();
