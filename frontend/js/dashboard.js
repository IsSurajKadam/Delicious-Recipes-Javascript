const oldpasswordField=document.getElementById("oldpassword");
const toggle=document.getElementById("toggleicon");
oldpasswordField.addEventListener("input",()=>
{
  toggle.style.display=oldpasswordField.value ? "block":"none";
})
const newpasswordField=document.getElementById("newpassword");
const toggle1=document.getElementById("toggleicon1");
newpasswordField.addEventListener("input",()=>
{
  toggle1.style.display=newpasswordField.value ? "block":"none";
})

const confirmPasswordField=document.getElementById("confirmpassword");
const toggle2=document.getElementById("toggleicon2");
confirmPasswordField.addEventListener("input",()=>
{
  toggle2.style.display=confirmPasswordField.value ? "block" :"none";
})

toggle.addEventListener("click",()=>
{
  if(oldpasswordField.type==='password')
  {
    oldpasswordField.type="text";
    toggle.classList.remove('fa-eye');
    toggle.classList.add("fa-eye-slash");
  }
  else
  {
    oldpasswordField.type='password';
    toggle.classList.remove('fa-eye-slash');
    toggle.classList.add("fa-eye");
  }
})

toggle1.addEventListener("click",()=>
{
  if(newpasswordField.type==='password')
  {
    newpasswordField.type='text';
    toggle1.classList.remove("fa-eye");
    toggle1.classList.add("fa-eye-slash");
  }
  else
  {
    newpasswordField.type='password';
    toggle1.classList.remove("fa-eye-slash");
    toggle1.classList.add("fa-eye");
  }
})
toggle2.addEventListener("click",()=>
  {
    if(confirmPasswordField.type==='password')
    {
      confirmPasswordField.type='text';
      toggle2.classList.remove("fa-eye");
      toggle2.classList.add("fa-eye-slash");
    }
    else
    {
      confirmPasswordField.type='password';
      toggle2.classList.remove("fa-eye-slash");
      toggle2.classList.add("fa-eye");
    }
  })

const recipeTableBody = document.querySelector("#recipeTable tbody");
const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const fethUploader=async()=>{
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "../Template/login.html";  
    return;
  }

  try {
   
    const response = await fetch("http://localhost:5500/api/users/uploader", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch uploader details");
    }

    const data = await response.json();
    
    
    document.getElementById("name").textContent = data.user.username;
    document.getElementById("useremail").textContent = data.user.email;
    const profilePhoto=document.getElementById("Photo")
    if(data.user.ProfilePhotoUrl)
    {
      profilePhoto.src=data.user.ProfilePhotoUrl
    }
    else
    {
      profilePhoto.src="/frontend/images/download.jpeg"
    }

  

  
    
    data.recipes.forEach(recipe => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${recipe.title}</td>
        <td>${recipe.category}</td>
        <td>${new Date(recipe.createdAt).toLocaleDateString()}</td>
        <td><button onclick="deleteRecipe('${recipe._id}')">Delete</button>
        <button class="editBtn" data-id="${recipe._id}">Edit</button>
        </td>
      `;

      recipeTableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    alert("Failed to load your dashboard data. Please try again later.");
  }
};
fethUploader();

recipeTableBody.addEventListener('click', (event) => {
  if (event.target.classList.contains('editBtn')) {
    currentRecipeId = event.target.dataset.id;

    fetch(`http://localhost:5500/api/recipes/${currentRecipeId}`)
      .then(response => response.json())
      .then(recipe => {
        document.getElementById('recipeTitle').value = recipe.title;
        document.getElementById("Category").value=recipe.category;
        document.getElementById('recipeIngredients').value = recipe.ingredients.join(', ');
        document.getElementById('recipeInstructions').value = recipe.instructions;
  console.log(recipe.category)
        editPopup.style.display = 'flex';
      })
      .catch(err => console.error('Failed to fetch recipe details:', err));
  }
})
document.getElementById("closePopup").addEventListener('click',()=>
{
  document.getElementById("editPopup").style.display='none'
})
document.getElementById("editRecipeForm").addEventListener('submit', async(event)=>
{
  event.preventDefault();
  const updatedRecipe={
    title:document.getElementById("recipeTitle").value,
    ingredients:document.getElementById("recipeIngredients").value,
    instructions:document.getElementById("recipeInstructions").value
  }

  fetch(`http://localhost:5500/api/recipes/${currentRecipeId}`,{
    method:'PUT',
    headers:{
      'Content-Type':'application/json',
      Authorization:`Bearer ${localStorage.getItem('authToken')}`
    },body:JSON.stringify(updatedRecipe)
  }).then(response=>{
    if(response.ok)
    {
      alert("Recipe updated successfull")
      location.reload();
    }
    else{
      console.error("Failed to update");
    }
  }).catch(err=>console.error('Error updating',err))
})
async function deleteRecipe(recipeId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You must be logged in to delete a recipe.");
    return;
  }

  if (!confirm("Are you sure you want to delete this recipe?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5500/api/recipes/${recipeId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Recipe deleted successfully!");
      window.location.reload();  
    } else {
      const data = await response.json();
      alert(data.error || "Failed to delete recipe.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the recipe.");
  }
}

async function fetchUserReviews() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please log in to view your reviews.");
    window.location.href = "login.html";
    return;
  }

  try {

    const userDetailsResponse = await fetch("http://localhost:5500/api/user", {
      method:"GET",
  headers: { "Authorization": `Bearer ${token}` },
});

if (!userDetailsResponse.ok) {
  throw new Error("Failed to fetch user details.");
}

const userDetails = await userDetailsResponse.json();
const userId = userDetails.user._id;
console.log(userDetails.user._id)

    const response = await fetch(`http://localhost:5500/api/recipes/reviews/user/${userId}`, {
      method:"GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    const reviewsContainer = document.getElementById("reviews-container");
    const reviessection=document.getElementById("reviewSection");

    if (response.status === 404) {
      reviessection.innerHTML=`<h1 style="text-align:center; background-color:white; padding:10px;">You not posted any reviews</h1>`
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user reviews.");
    }

    const reviews = await response.json();
    console.log(reviews)
    //const reviewsContainer = document.getElementById("reviews-container");
    

  

 
    reviewsContainer.innerHTML = reviews.map(review => `
      <div class="review-card" id="review-${review.review._id}">
        <img src="${review.imageUrl}" alt="image"/>
        <h3>${review.recipeTitle}</h3>
        <p>Category: ${review.category}</p>
        <p>Rating: ${review.review.rating} ⭐</p>
        <p>${review.review.comment}</p>
        <button class="delete-btn" onclick="deleteReview('${review.review._id}')">Delete</button>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
   
  }
}


async function deleteReview(reviewId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please log in to delete reviews.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5500/api/recipes/reviews/${reviewId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to delete review.");
    }

   
    document.getElementById(`review-${reviewId}`).remove();
    alert("Review deleted successfully.");
  } catch (err) {
    console.error(err);
    alert("Unable to delete the review. Please try again later.");
  }
}
fetchUserReviews()

async function fetchGraph() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please log in to access the dashboard.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5500/api/users/uploader", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch dashboard data");
    const data = await response.json();

    // ←─ Add this block:
    if (!data.recipes || data.recipes.length === 0) {
      const chartcontainer = document.getElementById("performanceChart").parentElement;
      chartcontainer.innerHTML = `<p class="no-data">You haven’t posted any recipes yet.</p>`;
      return;
    }

    const recipeTitles = data.recipes.map(r => r.title);
    const recipeLikes  = data.recipes.map(r => r.likes.length);
    const recipeViews  = data.recipes.map(r => r.views);

    const ctx = document.getElementById("performanceChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: recipeTitles,
        datasets: [
          { label: "Likes", data: recipeLikes, fill: true, tension: 0.4 },
          { label: "Views", data: recipeViews, fill: true, tension: 0.4 },
        ]
      },
      options: {         responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Recipe Likes and Views Performance",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Count",
            },
          },
          x: {
            title: {
              display: true,
              text: "Recipes",
            },
          },
        },}
    });
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    alert("Unable to load dashboard data. Please try again later.");
  }
}



const popupContainer = document.getElementById("popup-container");
const updateProfileBtn = document.getElementById("update-profile-btn");
const closePopupBtn = document.getElementById("close-popup-btn");

const token = localStorage.getItem("authToken"); 


updateProfileBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:5500/api/users/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Failed to fetch user details.");
      return;
    }

    const user = await response.json();
    console.log(user.user.email)
  
     

    
    document.getElementById("username").value = user.user.username;
    document.getElementById("email").value = user.user.email || "";
    document.getElementById("role").value=user.user.role||"";


  
    popupContainer.style.display = "flex";
  } catch (err) {
    console.error("Error fetching user details:", err);
    alert("An error occurred while fetching user details.");
  }
});


closePopupBtn.addEventListener("click", () => {
  popupContainer.style.display = "none";
});


document.getElementById("update-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const username=document.getElementById("username").value;
  const email=document.getElementById("email").value;
  formData.append("username",username);
  formData.append("email",email);

  const profilePhotoInput = document.getElementById("profilePhoto");
  console.log(profilePhotoInput.files[0])
  if (profilePhotoInput.files.length > 0) {
 
    formData.append("profilePhoto",profilePhotoInput.files[0]);
  }

  try {
    const response = await fetch("http://localhost:5500/api/users/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Profile updated successfully!");
      location.reload();
      popupContainer.style.display = "none"; 
    } else {
      alert(result.error || "Failed to update profile.");
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("An error occurred while updating the profile.");
  }
});

const popupPasswordContainer = document.getElementById("password");
const updatePasswordBtn = document.getElementById("update-password-btn");
const closePasswordPopupBtn = document.getElementById("close-password-popup-btn");
const updatePasswordForm = document.getElementById("update-password-form");
const token1 = localStorage.getItem("authToken");

updatePasswordBtn.addEventListener("click", () => {
  popupPasswordContainer.style.display = "flex";
});

closePasswordPopupBtn.addEventListener("click", () => {
  popupPasswordContainer.style.display = "none";
});

updatePasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const oldPassword = document.getElementById("oldpassword").value;
  const newPassword = document.getElementById("newpassword").value;
  const confirmPassword = document.getElementById("confirmpassword").value;

  try {
    const response = await fetch("http://localhost:5500/api/users/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Password updated successfully!");
      popupPasswordContainer.style.display = "none"; 
      updatePasswordForm.reset(); 
    } else {
      alert(result.error || "Failed to update password.");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    alert("An error occurred while updating the password.");
  }
});






document.addEventListener("DOMContentLoaded", fetchGraph);
