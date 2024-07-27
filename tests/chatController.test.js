const { fetchChatHistory, postUserInput, fetchChatByUserId, addNewChat, editChatTitle, deleteChat } = require("../controller/chatBotController");
const ChatHistory = require("../models/chat_History");
const Chat = require("../models/chat");
const geminiChatModel = require("../geminiChatConfig");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

// Mock dependencies
jest.mock("../models/chat_History", () => ({
    fetchChatHistory: jest.fn(),
    addChatHistory: jest.fn(),
}));

jest.mock("../models/chat", () => ({
    fetchChatByUserId: jest.fn(),
    addNewChat: jest.fn(),
    editChatTitle: jest.fn(),
    deleteChat: jest.fn(),
}));

jest.mock("../geminiChatConfig", () => ({
    startChatForUser: jest.fn(),
}));

jest.mock("fs");
jest.mock("jsdom");

describe("Chat Controller", () => {
    describe("fetchChatHistory", () => {
        it("should return chat history if it exists", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ChatHistory.fetchChatHistory.mockResolvedValue({ chatHistory: [{ message: "Hello" }] });

            await fetchChatHistory(req, res);

            expect(ChatHistory.fetchChatHistory).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ chatHistory: [{ message: "Hello" }] });
        });

        it("should add default messages if chat history does not exist", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ChatHistory.fetchChatHistory.mockResolvedValue({ chatHistory: [] });
            ChatHistory.addChatHistory.mockResolvedValue();

            await fetchChatHistory(req, res);

            expect(ChatHistory.addChatHistory).toHaveBeenCalledTimes(2);
            expect(ChatHistory.addChatHistory).toHaveBeenCalledWith("user", "What are your functions?", "123");
            expect(ChatHistory.addChatHistory).toHaveBeenCalledWith("model", expect.any(String), "123");
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should handle errors", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            ChatHistory.fetchChatHistory.mockRejectedValue(new Error("Database error"));

            await fetchChatHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });
/*
    describe("postUserInput", () => {
        it("should post user input and return response from AI", async () => {
            const req = { body: { query: "Hello" }, params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            const mockChat = { sendMessage: jest.fn().mockResolvedValue({ response: { text: jest.fn().mockResolvedValue("Hello back") } }) };
            geminiChatModel.startChatForUser.mockResolvedValue(mockChat);
            ChatHistory.addChatHistory.mockResolvedValue();

            await postUserInput(req, res);

            expect(geminiChatModel.startChatForUser).toHaveBeenCalledWith("123");
            expect(mockChat.sendMessage).toHaveBeenCalledWith("Hello");
            expect(ChatHistory.addChatHistory).toHaveBeenCalledTimes(2);
            expect(ChatHistory.addChatHistory).toHaveBeenCalledWith("user", "Hello", "123");
            expect(ChatHistory.addChatHistory).toHaveBeenCalledWith("model", "Hello back", "123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Hello back" });
        });

        it("should handle errors", async () => {
            const req = { body: { query: "Hello" }, params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            geminiChatModel.startChatForUser.mockRejectedValue(new Error("AI error"));

            await postUserInput(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
        });
    });
*/
    describe("fetchChatByUserId", () => {
        it("should return chat conversations for a given user ID", async () => {
            const req = { params: { userId: "456" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.fetchChatByUserId.mockResolvedValue([{ conversationId: "123", title: "Test Chat" }]);

            await fetchChatByUserId(req, res);

            expect(Chat.fetchChatByUserId).toHaveBeenCalledWith("456");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ conversationId: "123", title: "Test Chat" }]);
        });

        it("should handle errors", async () => {
            const req = { params: { userId: "456" } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            Chat.fetchChatByUserId.mockRejectedValue(new Error("Database error"));

            await fetchChatByUserId(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error retrieving comments for userId: 456");
        });
    });

    describe("addNewChat", () => {
        it("should create a new chat conversation", async () => {
            const req = { body: { conversationTitle: "New Chat" }, params: { userId: "456" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.addNewChat.mockResolvedValue({ conversationId: "789", title: "New Chat" });

            await addNewChat(req, res);

            expect(Chat.addNewChat).toHaveBeenCalledWith("New Chat", "456");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ conversationId: "789", title: "New Chat" });
        });

        it("should handle foreign key constraint errors", async () => {
            const req = { body: { conversationTitle: "New Chat" }, params: { userId: "456" } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            Chat.addNewChat.mockRejectedValue(new Error("User ID does not exist"));

            await addNewChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("User ID does not exist. Cannot create conversation.");
        });

        it("should handle other errors", async () => {
            const req = { body: { conversationTitle: "New Chat" }, params: { userId: "456" } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            Chat.addNewChat.mockRejectedValue(new Error("Unknown error"));

            await addNewChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error creating conversation");
        });
    });

    describe("editChatTitle", () => {
        it("should update chat title", async () => {
            const req = { body: { conversationTitle: "Updated Chat" }, params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.editChatTitle.mockResolvedValue({ conversationId: "123", title: "Updated Chat" });

            await editChatTitle(req, res);

            expect(Chat.editChatTitle).toHaveBeenCalledWith("Updated Chat", "123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Conversation updated successfully" });
        });

        it("should return 404 if conversation is not found", async () => {
            const req = { body: { conversationTitle: "Updated Chat" }, params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            Chat.editChatTitle.mockResolvedValue(null);

            await editChatTitle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("Conversation not found");
        });

        it("should handle errors", async () => {
            const req = { body: { conversationTitle: "Updated Chat" }, params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

            Chat.editChatTitle.mockRejectedValue(new Error("Database error"));

            await editChatTitle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error updating conversationTitle");
        });
    });

    describe("deleteChat", () => {
        it("should delete a chat conversation", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.deleteChat.mockResolvedValue(true);

            await deleteChat(req, res);

            expect(Chat.deleteChat).toHaveBeenCalledWith("123");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Conversation deleted successfully' });
        });

        it("should return 404 if conversation is not found", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.deleteChat.mockResolvedValue(false);

            await deleteChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Conversation not found' });
        });

        it("should handle errors", async () => {
            const req = { params: { conversationId: "123" } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

            Chat.deleteChat.mockRejectedValue(new Error("Deletion error"));

            await deleteChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting conversation', error: 'Deletion error' });
        });
    });
});
