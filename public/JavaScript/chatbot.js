// const { populate } = require("dotenv");

// Current User
const user_id = localStorage.getItem("user_id");
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

let chatData = [];

const sidebar = document.getElementById("sidebar");
const sendBtn = document.getElementById("sendBtn");
const inputBox = document.getElementById("inputBox");
const addNewConversation = document.getElementById("addNewChat");

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

const setContainerHeight = async () => {
    try {
        // Get the navbar element
        const navbar = document.querySelector(".navbar");

        // Check if the navbar exists
        if (navbar) {
            // Get the height of the navbar
            const navbarHeight = navbar.offsetHeight;

            // Calculate the remaining height
            const remainingHeight = `calc(100vh - ${navbarHeight}px)`;

            // Set the CSS variable for container height
            document.documentElement.style.setProperty('--containerHeight', remainingHeight);
        }
    } catch (error) {
        console.error("Error setting container height:", error);
    }
};

// Function to fetch chat conversations
const fetchChatConversations = async () => {
    try {
        let chatData = [];
        const decodedToken = parseJwt(token);
        console.log(decodedToken);
        const user_id = decodedToken.user_id;

        // Send POST request to fetch chat conversations
        const response = await fetch(`/chatbot/conversation/${user_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: user_id,
            token: token
          })
        });

        // Check if the request was successful
        if (response.ok) {
            const responseData = await response.json(); // Convert the response to JSON

            // Process each conversation
            for (const conversation of responseData) {
                const history = await getConversationHistroy(conversation.conversationId);

                const completeChat = {
                    conversationId: conversation.conversationId,
                    conversationTitle: conversation.conversationTitle,
                    conversationHistory: history                    
                };

                // Append the completeChat object to chatData
                chatData.push(completeChat);
            }
            return chatData;
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
            const errorText = await response.text(); // Read the error response text
            console.error(`Error details: ${errorText}`);
        }
    } catch (error) {
        console.error('Error fetching chat conversations:', error);
    }
};

// Function to get conversation history
const getConversationHistroy = async (conversationID) => {
    try {
        const response = await fetch(`/chatbot/${conversationID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData;
        } else {
            console.error(`HTTP error! Status: ${response.status}`);
            const errorText = await response.text();
            console.error(`Error details: ${errorText}`);
        }
    } catch (error) {
        console.error('Error fetching conversation history:', error);
    }
};

const createNewConversation = async () =>{
    if (user_id === null){
        showToast("Login Before Trying Out Our ChatBot!");
        return;
    }

    const userInput = window.prompt("Enter your Chat Title:").trim();
    if (userInput) {
        // Handle the user input
        console.log(`User entered: ${userInput}`);
    } else if (userInput === "" || null){
        // Handle the case when user cancels or enters an empty input
        showToast("Do not leave it empty.");
        return;
    }

    try {
        // Send POST request
        const response = await fetch(`/chatbot/history/${user_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationTitle: userInput,
                user_id: user_id,
                token: token
            })
        });

        // Check if the request was successful
        if (response.ok) {
            const responseData = await response.json(); // Parse JSON response
            console.log(responseData); // Log the entire response data

            // Extract the message from the response
            const message = responseData.message;
            console.log(`Server message: ${message}`);

            chatData = await fetchChatConversations(); // Await the result of fetchChatConversations
            if (chatData.length > 0){
                dispalyChats(chatData); // Pass the resolved chatData to dispalyChats
            }
            else{
                await createNewConversation();
            }
        } else {
            // Handle errors
            console.error(`HTTP error! Status: ${response.status}`);
            const errorText = await response.text();
            console.error(`Error details: ${errorText}`);
            showToast(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showToast("Error sending message.");
    }

}
// Function to display chats
const dispalyChats = (chatData) => {
    console.log(chatData);
    // Assuming you have a function createChatNavbarItem to create list items
    const sidebar = document.querySelector('.sidebar ul');
    sidebar.innerHTML = ""; // Assuming you have a <ul> in your sidebar
    chatData.forEach(conversation => {
        sidebar.appendChild(createChatNavbarItem(conversation));
    });
};

// Call the functions when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    setContainerHeight();
    chatData = await fetchChatConversations(); // Await the result of fetchChatConversations
    if (chatData.length > 0){
        dispalyChats(chatData); // Pass the resolved chatData to dispalyChats
    }
    else{
        await createNewConversation();
    }
    
});


//Handles Bad And Good Requests
async function handleResponse(response, successfulMsg) {
    if (response.ok) {
      if (successfulMsg){
        showToast(successfulMsg);
      }
      
      return await response.json();
    } else if (response.status === 400) {
      const errorData = await response.json();
      console.error("Validation error:", errorData.errors);
      showToast("Validation error: " + errorData.errors.join(", "));
      throw new Error("Validation error");
    } else if (response.status === 401) {
      const errorData = await response.json();
      console.error("Access error:", errorData.details);
      showToast("Access error: " + errorData.details);
      throw new Error("Access error");
    }else if (response.status === 402) {
      const errorData = await response.json();
      console.error("Access error:", errorData.details);
      showToast("Access error: " + errorData.details);
      throw new Error("Access error");
    } else {
      console.error("Unexpected response status:", response.status);
      showToast("Unexpected error occurred. Please try again.");
      throw new Error("Unexpected error");
    }
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
  
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the toast from the DOM after it fades out
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}

function createChatNavbarItem(conversation){
    let title = conversation.conversationTitle;
    let id = conversation.conversationId;
    const li = document.createElement("li");
    const h1delete = document.createElement("li");
    const h1edit = document.createElement("li");
    h1delete.textContent = "X";
    h1delete.dataset.conversationId = id;
    addOnclickListenerToDeleteChat(h1delete);

    h1edit.textContent = "🖋️";
    h1edit.dataset.conversationId = id;
    addOnclickListenerToEditChatTitle(h1edit);
    
    li.dataset.conversationId = id;
    li.innerText = title;
    li.classList.add("sidebar-chat-option");
    li.appendChild(h1edit);
    li.appendChild(h1delete);
    addOnclickListenerForChatNavigation(li);
    return li;
}

function addOnclickListenerForChatNavigation(li) {
    li.addEventListener("click", () => {
        // Access the data-conversationId attribute using dataset
        const conversationId = li.dataset.conversationId;
        
        
        sendBtn.dataset.conversationId = conversationId;

        // Find the conversation data from chatData using conversationId
        const conversation = chatData.find(c => c.conversationId === parseInt(conversationId)); // Ensure correct type
        
        // If the conversation exists, populate the chat window
        if (conversation) {
            populateChatWindow(conversation)
        } else {
            console.error("Conversation not found");
        }
    });
}

function addOnclickListenerToDeleteChat(h1) {
    h1.addEventListener("click", async () => {
        // Access the data-conversationId attribute using dataset
        const conversationId = h1.dataset.conversationId;
        
        try {
            // Send POST request
            const response = await fetch(`/chatbot/conversation/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    token: token
                })
            });

            if (response.ok) {
                const responseData = await response.json(); // Parse JSON response
                console.log(responseData); // Log the entire response data
    
                // Extract the message from the response
                const message = responseData.message;
                console.log(`Server message: ${message}`);

                chatData = await fetchChatConversations(); // Await the result of fetchChatConversations
                if (chatData.length > 0){
                    dispalyChats(chatData); // Pass the resolved chatData to dispalyChats
                }
                else{
                    await createNewConversation();
                }
            }else {
                // Handle errors
                console.error(`HTTP error! Status: ${response.status}`);
                const errorText = await response.text();
                console.error(`Error details: ${response.message}`);
                showToast(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            showToast("Error deleting chat.");
        }
    });
}

function addOnclickListenerToEditChatTitle(h1){
    h1.addEventListener("click", async () => {

        if (user_id === null){
            showToast("Login Before Trying Out Our ChatBot!");
            return;
        }

        if (chatData === null || chatData.length === 0){
            showToast("Create A Chat First!");
            return;
        }
    
        const userInput = window.prompt("Enter your Newcd  Chat Title:").trim();
        if (userInput) {
            // Handle the user input
            console.log(`User entered: ${userInput}`);
        } else if (userInput === "" || null){
            // Handle the case when user cancels or enters an empty input
            showToast("Do not leave it empty.");
            return;
        }


        // Access the data-conversationId attribute using dataset
        const conversationId = h1.dataset.conversationId;
        
        try {
            // Send POST request
            const response = await fetch(`/chatbot/conversation/${conversationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversationTitle: userInput,
                    user_id: user_id,
                    token: token
                })
            });

            if (response.ok) {
                const responseData = await response.json(); // Parse JSON response
                console.log(responseData); // Log the entire response data
    
                // Extract the message from the response
                const message = responseData.message;
                console.log(`Server message: ${message}`);

                chatData = await fetchChatConversations(); // Await the result of fetchChatConversations
                if (chatData.length > 0){
                    dispalyChats(chatData); // Pass the resolved chatData to dispalyChats
                }
                else{
                    await createNewConversation();
                }
            }else {
                // Handle errors
                console.error(`HTTP error! Status: ${response.status}`);
                const errorText = await response.text();
                console.error(`Error details: ${response.message}`);
                showToast(`Error: ${errorText}`);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            showToast("Error deleting chat.");
        }
    });

}
sendBtn.addEventListener("click", async () => {
    const conversationID = sendBtn.dataset.conversationId;
    let text = inputBox.value.trim();
    console.log("conversationID: ", conversationID);
    
    // Check if the text is empty
    if (!text) {
        showToast("Enter a message.");
        return; // Stop the rest of the function execution
    }

    try {
        // Send POST request
        const response = await fetch(`/chatbot/${conversationID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: text,
                user_id: user_id,
                token: token
            })
        });

        // Check if the request was successful
        if (response.ok) {
            const responseData = await response.json(); // Parse JSON response
            console.log(responseData); // Log the entire response data

            // Extract the message from the response
            const message = responseData.message;
            console.log(`Server message: ${message}`);

            // Find the conversation and add the new messages
            const conversation = chatData.find(conv => conv.conversationId == conversationID);
            if (conversation) {
                // Create new chat entries
                const userMessage = {
                    chatHistoryId: Date.now(), // Use timestamp or some unique ID
                    role: 'user',
                    text: text,
                    timeStamp: new Date().toISOString(),
                    conversationId: conversationID
                };
                const modelMessage = {
                    chatHistoryId: Date.now() + 1, // Ensure unique ID
                    role: 'model',
                    text: message,
                    timeStamp: new Date().toISOString(),
                    conversationId: conversationID
                };
                
                // Add messages to the chatHistory
                conversation.conversationHistory.chatHistory.push(userMessage, modelMessage);
                populateChatWindow(conversation);
            } else {
                console.error(`Conversation with ID ${conversationID} not found.`);
            }
        } else {
            // Handle errors
            console.error(`HTTP error! Status: ${response.status}`);
            const errorText = await response.text();
            console.error(`Error details: ${errorText}`);
            showToast(`Error: ${errorText}`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showToast("Error sending message.");
    }

    // Clear the input box
    inputBox.value = ""; // Use value instead of innerText for input elements
});

addNewConversation.addEventListener("click", async () =>{
    createNewConversation();
})

function populateChatWindow(conversation){
    const chatWindow = document.getElementById("messages");
    chatWindow.innerHTML = "";

    // Populate the chat window with conversation history
    conversation.conversationHistory.chatHistory.forEach(message => {
        const messageElement = document.createElement("div");
        console.log("123123")
        if (message.role === "user"){
            messageElement.classList.add("message");
            messageElement.classList.add("user");
        }else{
            messageElement.classList.add("message");
            messageElement.classList.add("model");
        }

        messageElement.innerHTML = message.text

        chatWindow.appendChild(messageElement);
    });
}