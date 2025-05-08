
const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("authToken"); 
  if (!token) {
    alert("You must be logged in to upload a recipe.");
    return; 
  }

  const formData = new FormData(e.target);

  try {
    const response = await fetch("http://localhost:5500/api/recipes/upload", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,  
      },
      body: formData,  
    });

    if (response.ok) {
      alert("Recipe uploaded successfully!");
      e.target.reset(); 
    } else {
      const errorData = await response.json();
      alert(`Failed to upload recipe. Error: ${errorData.error || "Try again."}`);
    }
  } catch (err) {
    console.error(err);
    alert("An error occurred. Please try again.");
  }
});
