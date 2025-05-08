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


async function fetchUserDetails() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please log in to view your dashboard.");
    window.location.href = "../Template/login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:5500/api/users/user", {
      method:"GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details.");
    }

    const { user } = await response.json();
    document.getElementById("name").textContent = user.username;
    document.getElementById("useremail").textContent = user.email;
    const profilePhoto = document.getElementById("Photo");
    profilePhoto.src = user.ProfilePhotoUrl || "/frontend/images/download.jpeg";
  } catch (err) {
    console.error(err);
    alert("Unable to load user details.");
  }
}
const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
navLinks.classList.toggle("show");
});


async function fetchUserReviews() {
const token = localStorage.getItem("authToken");
if (!token) {
alert("Please log in to view your reviews.");
window.location.href = "../Template/login.html";
return;
}

try {
const userDetailsResponse = await fetch("http://localhost:5500/api/users/user", {
  method: "GET",
  headers: { "Authorization": `Bearer ${token}` },
});

if (!userDetailsResponse.ok) {
  throw new Error("Failed to fetch user details.");
}

const userDetails = await userDetailsResponse.json();
const userId = userDetails.user._id;
console.log(userDetails.user._id);

const response = await fetch(`http://localhost:5500/api/recipes/reviews/user/${userId}`, {
  method: "GET",
  headers: { "Authorization": `Bearer ${token}` },
});

const reviewsContainer = document.getElementById("reviews-container");


if (response.status === 404) {
  reviewsContainer.innerHTML = `<h1>You have not posted any reviews.</h1>`;
  return;
}

if (!response.ok) {
  throw new Error("Failed to fetch user reviews.");
}

const reviews = await response.json();
console.log(reviews);

reviewsContainer.innerHTML = reviews.map(review => `
  <div class="review-card" id="review-${review.review._id}">
    <img src="${review.imageUrl}" alt="Recipe Image"/>
    <h3>${review.recipeTitle}</h3>
    <p>Category: ${review.category}</p>
    <p>Rating: ${review.review.rating} ⭐</p>
    <p>${review.review.comment}</p>
    <button class="delete-btn" onclick="deleteReview('${review.review._id}')">Delete</button>
  </div>
`).join("");
} catch (err) {
console.error(err);
const reviewsContainer = document.getElementById("reviews-container");
reviewsContainer.innerHTML = `<h1>An error occurred. Unable to load your reviews.</h1>`;
alert("Unable to load your reviews. Please try again later.");
}
}



async function deleteReview(reviewId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Please log in to delete reviews.");
    window.location.href = "../Template/login.html";
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

fetchUserDetails();
fetchUserReviews();

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


