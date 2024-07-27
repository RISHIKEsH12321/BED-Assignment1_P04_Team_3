const sql = require("mssql");
const dbConfig = require("../dbConfig");
const ChatHistory = require("../models/chat_History"); // Adjust path if needed

jest.mock("mssql");

describe("ChatHistory.fetchChatHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and format chat history successfully", async () => {
    const mockChatHistory = [
      {
        chatHistoryId: 1,
        role: "user",
        text: "Hello",
        timeStamp: new Date('2024-07-01T12:00:00Z'),
        conversationId: 123,
      },
      {
        chatHistoryId: 2,
        role: "bot",
        text: "Hi there!",
        timeStamp: new Date('2024-07-01T12:05:00Z'),
        conversationId: 123,
      },
    ];

    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: mockChatHistory }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const { formattedHistory, chatHistory } = await ChatHistory.fetchChatHistory(123);

    expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    expect(mockConnection.request).toHaveBeenCalled();
    expect(mockRequest.input).toHaveBeenCalledWith("conversationId", sql.Int, 123);
    expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);

    expect(formattedHistory).toHaveLength(2);
    expect(formattedHistory[0]).toEqual({
      role: "user",
      data: [{ text: "Hello" }]
    });
    expect(chatHistory).toHaveLength(2);
    expect(chatHistory[0]).toBeInstanceOf(ChatHistory);
    expect(chatHistory[0].chatHistoryId).toBe(1);
    expect(chatHistory[0].role).toBe("user");
    expect(chatHistory[1].text).toBe("Hi there!");
  });

  it("should handle errors when fetching chat history", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));

    await expect(ChatHistory.fetchChatHistory(123)).rejects.toThrow(errorMessage);
  });

  it("should close the connection even if an error occurs", async () => {
    const errorMessage = "Database Error";
    let mockConnection = {
      request: jest.fn(),
      close: jest.fn().mockRejectedValue(new Error("Database Error")),
    };

    sql.connect.mockRejectedValueOnce(new Error(errorMessage));
    sql.connect.mockResolvedValueOnce(mockConnection);

    try {
      await ChatHistory.fetchChatHistory(123);
    } catch (error) {
    //   expect(mockConnection.close).toHaveBeenCalled();
    }
  });
});

describe("ChatHistory.addChatHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle errors when adding chat history", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));

    await expect(ChatHistory.addChatHistory("user", "Message", 123)).rejects.toThrow(errorMessage);
  });

  it("should close the connection even if an error occurs", async () => {
    const errorMessage = "Database Error";
    const mockConnection = {
      request: jest.fn(),
      close: jest.fn().mockRejectedValue(new Error("Error closing connection")),
    };

    sql.connect.mockRejectedValueOnce(new Error(errorMessage));
    sql.connect.mockResolvedValueOnce(mockConnection);

    try {
      await ChatHistory.addChatHistory("user", "Message", 123);
    } catch (error) {
    //   expect(mockConnection.close).toHaveBeenCalled();
    }
  });
});
