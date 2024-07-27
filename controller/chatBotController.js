const geminiChatModel = require("../geminiChatConfig");
const ChatHistory = require("../models/chat_History");
const Chat = require("../models/chat");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const startingPromt = 
"Hello! 👋 I'm AgriDynamic, your AI guide for insights across the agricultural industry. \
What can I help you with today? 😊 Are you interested in specific agricultural trends, current events, \
or perhaps looking for personalized advice in farming, crop management, or sustainable practices? \
Just let me know, and I'll do my best to assist you!";


async function startChatForUser(conversationId) {
  try {
    const { formattedHistory } = await ChatHistory.fetchChatHistory(conversationId);
    console.log("formattedHistory",formattedHistory);
    const geminiChat = await geminiChatModel.startChat({
      parts: formattedHistory || [
        {
          role: "user",
          parts: [
            "What are your functions?",
          ],
        },
        {
          role: "model",
          parts: [
            startingPromt
          ],
        },
      ] 
    });
    console.log("geminiChat", geminiChat);
    return geminiChat;
  } catch (error) {
    console.error('Error starting chat for user:', error);
    throw new Error("Error starting chat for user");
  }
}

const fetchChatHistory = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const { chatHistory } = await ChatHistory.fetchChatHistory(conversationId);
    if (!chatHistory || chatHistory.length === 0) {
      await ChatHistory.addChatHistory("user", "What are your functions?", conversationId);
      await ChatHistory.addChatHistory("model", startingPromt, conversationId);
      const { chatHistory } = await ChatHistory.fetchChatHistory(conversationId);
      return res.status(200).json({ chatHistory });
    }
    return res.status(200).json({ chatHistory }); // Respond with the full chat history
  } catch (error) {
    console.error("Error fetching AI chat history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const postUserInput = async (req, res) => {
  const query = req.body.query;
  const conversationId = req.params.conversationId;

  try {
      const geminiChat = await startChatForUser(conversationId);
      const result = await geminiChat.sendMessage(query);
      const response = await result.response;
      const text = await response.text();
      await ChatHistory.addChatHistory("user", query, conversationId);
      await ChatHistory.addChatHistory("model", text, conversationId);

      return res.status(200).json({ message: text });
  } catch (error) {
      console.error("Error querying AI:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchChatByUserId = async (req, res) =>{
  const userId = req.params.userId;
  
  try{
    const chatConversations = await Chat.fetchChatByUserId(userId);
    return res.status(200).json(chatConversations);
  } catch(err){
      console.error(`Error getting chatConversations for userId: ${userId}`, err);
      res.status(500).send(`Error retrieving comments for userId: ${userId}`);
  }
}

const addNewChat = async (req, res) => {
  const userId = req.params.userId;
  const conversationTitle = req.body.conversationTitle;

  try {
      const newChatConversation = await Chat.addNewChat(conversationTitle, userId);
      res.status(201).json(newChatConversation);
  } catch (err) {
      console.error('Error creating conversation:', err);

      // Check if the error is related to a foreign key constraint violation
      if (err.message.includes("User ID does not exist")) {
          res.status(404).send("User ID does not exist. Cannot create conversation.");
      } else {
          res.status(500).send("Error creating conversation");
      }
  }
};

const editChatTitle = async (req, res) => {
  const newTitle = req.body.conversationTitle
  const conversationId = req.params.conversationId;

  try{
    const updatedConversation = await Chat.editChatTitle(newTitle, conversationId);
    if (!updatedConversation){
      return res.status(404).send("Conversation not found");
    }
    return res.status(200).json({message: "Conversation updated successfully"});
  } catch(err){
    console.error(err);
    res.status(500).send("Error updating conversationTitle");
  }
};

const deleteChat = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
      const deleteConversation = await Chat.deleteChat(conversationId);
      if (deleteConversation) {
          res.status(200).json({ message: 'Conversation deleted successfully' });
      } else {
          res.status(404).json({ message: 'Conversation not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error deleting conversation', error: error.message });
  }
};

const displatChatbotPage = async (req ,res) =>{
  const filePath = path.join(__dirname, "../public", "html", "chatbot.html");
  console.log("File path is " + filePath);
  // Read the index.html file
  fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
          console.error("Error reading chatbot.html file:", err);
          res.status(500).send("Internal Server Error");
          return;
      }

      // Create a new JSDOM instance
      const dom = new JSDOM(data);

      // Serialize the modified document back to a string
      const document = dom.serialize();

      // Send the modified content as the response
      res.send(document);
  });

}


module.exports = {
  fetchChatHistory,
  postUserInput,
  fetchChatByUserId,
  addNewChat,
  editChatTitle,
  deleteChat,
  displatChatbotPage
};