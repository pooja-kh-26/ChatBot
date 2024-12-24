const chatBody = document.querySelector(".chat_body");
const messageInput = document.querySelector(".message_input");
const sendMsgButton = document.querySelector("#send_msg");

//API setup
const API_KEY = "AIzaSyDRpev8Yebj0uH-86iOsxTW8bA1ViW_qnk";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
    msg : null
}

// create a msg content with dynamic class and return it
const createMsgElement = (content, ...classes) =>{
    const div = document.createElement("div");
    div.classList.add("msg", ...classes);
    div.innerHTML = content;
    return div;
}

// Generate bot response using API
const generateBotResponse = async(incomingMsgDiv) => {
    const msgElement = incomingMsgDiv.querySelector(".msg_text");

    //API request option
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{
                "parts":[{"text": userData.msg}]
            }]
        })
    }
    try{
        //Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.msg);
        
        //Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        msgElement.innerText = apiResponseText;
    }catch (error) {
        console.log(error);
    } finally{
        incomingMsgDiv.classList.remove("thinking");
    }
}

// Handling outgoing msg
const handleOutgoingMsg = (e) => {
    e.preventDefault();
    userData.msg = messageInput.value.trim();
    messageInput.value = "";

    //create and display usr msg
    const msgContent = `<div class="msg_text"></div>`;

    const outgoingMsgDiv =  createMsgElement(msgContent, "user_msg");
    outgoingMsgDiv.querySelector(".msg_text").textContent = userData.msg;
    chatBody.appendChild(outgoingMsgDiv);

    // Simulate bot response with thinking indicator after a delay
    setTimeout(() =>  {
        const msgContent = `<img class="bot_avatar" src="https://img.icons8.com/?size=100&id=nPDSGnDmBUAl&format=png&color=000000" alt="ChatBot icon">
                <div class="msg_text">
                    <div class="thinking_indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMsgDiv =  createMsgElement(msgContent, "bot_msg", "thinking");
        chatBody.appendChild(incomingMsgDiv);
        generateBotResponse(incomingMsgDiv);
    },600);
}

//Handle enter key press for sending msg
messageInput.addEventListener("keydown", (e) => {
    const userMsg = e.target.value.trim();
    if(e.key === "Enter" && userMsg){
        handleOutgoingMsg(userMsg);
        //messageInput.value = ""; // Clear the input field
    }
});

sendMsgButton.addEventListener("click", (e) => handleOutgoingMsg(e))