

document.getElementById("mobileMenu").addEventListener("click", () => {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
});
async function fetchGamificationData() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to view the gamification dashboard.");
    return;
  }

  try {
    const [userResponse, challengesResponse, leaderboardResponse] = await Promise.all([
      fetch("http://localhost:5500/api/gamification/rewards", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5500/api/gamification/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5500/api/gamification/Leaderboard"),
    ]);

    if (userResponse.ok && challengesResponse.ok && leaderboardResponse.ok) {
      const user = await userResponse.json();
      console.log(user)
      const challenges = await challengesResponse.json();
      console.log(challenges)
      const leaderboard = await leaderboardResponse.json();

     
      document.querySelector("#points p").innerText = user.points;

      
      const badgeContainer = document.querySelector("#badges .badge-container");
      badgeContainer.innerHTML = user.badges.map((badge) => `<span>${badge}</span>`).join("");

     
      const challengesContainer = document.getElementById("challenges");
      challengesContainer.innerHTML = challenges
      if(challenges.length==0)
      {
        challengesContainer.innerHTML=`<p>No challenge avaliable..</p>`
      }
      else{
       challengesContainer.innerHTML= challenges.map((challenge) => `
          <div>
            <h3>${challenge.title}</h3>
            <p>${challenge.description}</p>
            <p>Target: ${challenge.target}</p>
            <p>Ends On: ${new Date(challenge.endDate).toLocaleDateString()}</p>
            <button onclick="markChallengeAsComplete('${challenge._id}')" id="challenge-${challenge._id}">Mark as Complete</button>
          </div>
        `)
        .join("");}

     
      const leaderboardContainer = document.getElementById("leaderboard");
      leaderboardContainer.innerHTML = leaderboard
        .map(
          (user, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${user.username}</td>
              <td>${user.points}</td>
            </tr>
          `
        )
        .join("");
    } else {
      throw new Error("Failed to fetch gamification data.");
    }
  } catch (error) {
    console.error(error);
    alert("Error fetching gamification data.");
  }
}

async function markChallengeAsComplete(challengeId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("You need to log in to complete challenges.");
    return;
  }
  console.log(challengeId)

  try {
    const response = await fetch(`http://localhost:5500/api/gamification/challenges/complete/${challengeId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Challenge marked as completed!");
      document.getElementById(`challenge-${challengeId}`).classList.add("completed");
     
    } else {
      const error = await response.json();
      alert(error.error || "Failed to complete the challenge.");
    }
  } catch (error) {
    console.error("Error completing challenge:", error);
    alert("Error completing the challenge.");
  }
}


document.addEventListener("DOMContentLoaded", fetchGamificationData);
