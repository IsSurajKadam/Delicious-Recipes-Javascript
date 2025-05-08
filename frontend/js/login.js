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

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userRole = document.getElementById("userRole").value;
  const errorMessage = document.getElementById("errorMessage");

  
  if (!email || !password || !userRole) {
    errorMessage.textContent = "Please fill in all fields (Email, Password, and Role).";
    return;
  }

  console.log("Sending request with:", { email, password, userRole });

  try {
    const response = await fetch("http://localhost:5500/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role: userRole }),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);

      if (data.role === "uploader") {
        alert("you are redirect into recipe upload page")
        window.location.href = "../Template/upload.html";
      } else if (data.role === "viewer") {
        alert("you are redirect into home page")
        window.location.href = "../Template/index.html";
      } 
    } else {
     
      errorMessage.textContent = data.error || "Something went wrong.";
    }
  } catch (error) {
    console.error("Error logging in:", error);
    errorMessage.textContent = "Something went wrong. Please try again later.";
  }
});
