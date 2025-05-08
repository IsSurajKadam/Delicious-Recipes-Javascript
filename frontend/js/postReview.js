document.getElementById("reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");
  console.log(recipeId)
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const errorMessage = document.getElementById("errorMessage");

  if (!recipeId || !rating || !comment) {
    errorMessage.textContent = "All fields are required.";
    return;
  }
  const token=localStorage.getItem("authToken");
  if(!token)
  {
    alert("You first log in")
    window.location.href="../Template/login.html";
  }

  try {
    const response = await fetch(`http://localhost:5500/api/recipes/${recipeId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ rating, comment }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Review submitted successfully!");
      window.location.href = `Browse.html?id=${recipeId}`;
    } else {
      errorMessage.textContent = data.error || "Failed to submit review. Please try again.";
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    errorMessage.textContent = "Something went wrong. Please try again later.";
  }
});
