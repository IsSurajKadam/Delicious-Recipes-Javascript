const menuToggle = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

  
    const userBubble = document.createElement("div");
    userBubble.className = "message user-message";
    userBubble.innerHTML = `<strong>You:</strong> ${userMessage}`;
    chatBox.appendChild(userBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = "";

    try {
        const response = await fetch("http://localhost:5500/api/ask-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        const botReply = formatResponse(data.reply || "Sorry, I couldn't find an answer.");

        
        const botBubble = document.createElement("div");
        botBubble.className = "message bot-message";
        botBubble.innerHTML = `<strong>AI Assistant:</strong><br>${botReply}`;
        chatBox.appendChild(botBubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorBubble = document.createElement("div");
        errorBubble.className = "message bot-message";
        errorBubble.innerHTML = `<strong>AI Assistant:</strong> Error getting response.`;
        chatBox.appendChild(errorBubble);
    }
}

function formatResponse(responseText) {
    return responseText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") 
        .replace(/\n/g, "<br>") 
        .replace(/(\d+\.)\s/g, "<br><strong>$1</strong> ")
        .replace(/\*\s/g, "<br>&bull; "); 
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let chatContent = document.getElementById("chatBox").innerText;

    doc.setFont("helvetica", "normal");
    doc.text("Chatbot Conversation", 10, 10);
    doc.setFontSize(12);
    let lines = doc.splitTextToSize(chatContent, 180);
    doc.text(lines, 10, 20);

    doc.save("chat_history.pdf");
}