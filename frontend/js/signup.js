
const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

const passwordField=document.getElementById("password");
const toggle=document.getElementById("toggleicon");

passwordField.addEventListener('input' ,()=>
{
  toggle.style.display=passwordField.value ? "block" :"none";
})
toggle.addEventListener('click',()=>
{
  if(passwordField.type==='password')
  {
    passwordField.type="text";
    toggle.classList.remove('fa-eye');
    toggle.classList.add("fa-eye-slash");

  }else
  {
    passwordField.type="password";
    toggle.classList.remove("fa-eye-slash");
    toggle.classList.add("fa-eye");
  }
})

document.getElementById("signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const profilePhoto = document.getElementById("profilePhoto").files[0];
  const errorMessage = document.getElementById("errorMessage");

  if (!username || !email || !password || !role) {
    errorMessage.textContent = "Please fill in all fields.";
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("role", role);
  if (profilePhoto) {
    formData.append("profilePhoto", profilePhoto);
  }

  try {
    const response = await fetch("http://localhost:5500/api/users/signup", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Signup successful");
      window.location.href = "../Template/login.html"; 
    } else {
      errorMessage.textContent = data.error || "Something went wrong. Please try again.";
    }
  } catch (error) {
    console.error("Error signing up:", error);
    errorMessage.textContent = "Something went wrong. Please try again later.";
  }
});
