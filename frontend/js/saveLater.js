const menuToggle = document.getElementById("mobileMenu");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
    async function fetchSavedRecipes() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You need to log in to view saved recipes!");
        location.href="../Template/login.html";
        return;
      }

      try {
        const response = await fetch("http://localhost:5500/api/recipes/users/saved", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (response.ok) {
          const savedRecipes = data.savedRecipes;
          const savedContainer = document.getElementById("saved-recipes");
          const messageContainer = document.getElementById("message");

          if (savedRecipes.length > 0) {
            savedContainer.innerHTML = savedRecipes
              .map(
                (recipe) => `
              <div class="recipe-card" id="saved-${recipe._id}">
                <img src="${recipe.imageUrl}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>Category: ${recipe.category}</p>
                <p>Views: ${recipe.views}</p>
                <p>Likes: ${recipe.likes.length}</p>
                <button onclick="removeSaved('${recipe._id}')">Remove</button>
                <button onclick="viewRecipe('${recipe._id}')">View Details</button>
              </div>
            `
              )
              .join("");
            messageContainer.innerHTML = "";
          } else {
            savedContainer.innerHTML = ""; 
            messageContainer.innerHTML = "<p>You have not saved any recipes.</p>"; // Show a styled message
          }
        } else {
          alert("Failed to fetch saved recipes.");
        }
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      }
    }

    async function removeSaved(recipeId) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You need to log in to perform this action!");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5500/api/recipes/${recipeId}/unsave`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          alert("Recipe removed from saved!");
          fetchSavedRecipes(); 
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to remove the recipe.");
        }
      } catch (error) {
        console.error("Error removing saved recipe:", error);
      }
    }

    function viewRecipe(id) {
      window.location.href = `Browse.detail.html?id=${id}`;
    }

    
    fetchSavedRecipes();