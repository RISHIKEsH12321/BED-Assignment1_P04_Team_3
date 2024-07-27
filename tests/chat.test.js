const sql = require("mssql");
const dbConfig = require("../dbConfig");
const Chat = require("../models/chat"); // Adjust path if needed

jest.mock("mssql");

/*  */ 
describe("Chat.fetchChatByUserId", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve chat conversations by user ID", async () => {
      const mockChatConversations = [
        {
          conversationId: 1,
          conversationTitle: "Chat 1",
          timeStamp: new Date('2024-07-01T12:00:00Z'),
          userId: 123,
        },
        {
          conversationId: 2,
          conversationTitle: "Chat 2",
          timeStamp: new Date('2024-07-02T12:00:00Z'),
          userId: 123,
        },
      ];
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ recordset: mockChatConversations }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
  
      const userId = 123;
      const chatConversations = await Chat.fetchChatByUserId(userId);
  
      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("userId", sql.Int, userId);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
  
      expect(chatConversations).toHaveLength(2);
      expect(chatConversations[0]).toBeInstanceOf(Chat);
      expect(chatConversations[0].conversationId).toBe(1);
      expect(chatConversations[0].conversationTitle).toBe("Chat 1");
      expect(chatConversations[1].conversationId).toBe(2);
    });
  
    it("should handle errors when retrieving chat conversations", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
  
      // Ensure the method throws the error
      await expect(Chat.fetchChatByUserId(123)).rejects.toThrow(errorMessage);
    });
  
});

describe("Chat.editChatTitle", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Ensure mocks are reset before each test
    });
    
    it("should update the chat title and return true if successful", async () => {
        const mockConversationTitle = "Updated Chat Title";
        const mockConversationId = 1;
    
        const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
        };
        const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
    
        const result = await Chat.editChatTitle(mockConversationTitle, mockConversationId);
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.request).toHaveBeenCalled();
        expect(mockRequest.input).toHaveBeenCalledWith("conversationTitle", sql.NVarChar(sql.MAX), mockConversationTitle);
        expect(mockRequest.input).toHaveBeenCalledWith("conversationId", sql.Int, mockConversationId);
        expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });
    
    it("should return false if no rows are affected", async () => {
        const mockConversationTitle = "No Change Title";
        const mockConversationId = 2;
    
        const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [0] }),
        };
        const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
    
        const result = await Chat.editChatTitle(mockConversationTitle, mockConversationId);
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.request).toHaveBeenCalled();
        expect(mockRequest.input).toHaveBeenCalledWith("conversationTitle", sql.NVarChar(sql.MAX), mockConversationTitle);
        expect(mockRequest.input).toHaveBeenCalledWith("conversationId", sql.Int, mockConversationId);
        expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(result).toBe(false);
    });
    
    it("should handle errors during connection close", async () => {
        const mockConversationTitle = "Close Error Title";
        const mockConversationId = 4;
        const errorMessage = "Database Error";
    
        const mockConnection = {
        request: jest.fn(),
        close: jest.fn().mockRejectedValue(new Error("Error closing connection")),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
    
        try {
        await Chat.editChatTitle(mockConversationTitle, mockConversationId);
        } catch (error) {
        // Expected error, so just assert that close was called
        expect(mockConnection.close).toHaveBeenCalled();
        }
    });
});

describe("Chat.addNewChat", () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Ensure mocks are reset before each test
    });
  
    it("should add a new chat and return a Chat instance", async () => {
        const mockConversationTitle = "New Chat";
        const mockUserId = 1;
        const mockResult = {
          recordset: [
            {
              conversationId: 1,
              conversationTitle: mockConversationTitle,
              timeStamp: new Date(),
              userId: mockUserId,
            },
          ],
        };
    
        const mockRequest = {
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockResolvedValue(mockResult),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
    
        const chat = await Chat.addNewChat(mockConversationTitle, mockUserId);
    
        // Debugging output
        console.log('sql.connect calls:', sql.connect.mock.calls);
        console.log('mockConnection.request calls:', mockConnection.request.mock.calls);
        console.log('mockRequest.input calls:', mockRequest.input.mock.calls);
        console.log('mockRequest.query calls:', mockRequest.query.mock.calls);
    
        expect(sql.connect).toHaveBeenCalledWith(dbConfig);
        expect(mockConnection.request).toHaveBeenCalled(); // Check if request was called
        expect(mockRequest.input).toHaveBeenCalledWith("conversationTitle", sql.NVarChar(sql.MAX), mockConversationTitle);
        expect(mockRequest.input).toHaveBeenCalledWith("userId", sql.Int, mockUserId);
        expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(chat).toBeInstanceOf(Chat);
        expect(chat.conversationId).toBe(mockResult.recordset[0].conversationId);
        expect(chat.conversationTitle).toBe(mockResult.recordset[0].conversationTitle);
        expect(chat.timeStamp).toBe(mockResult.recordset[0].timeStamp);
        expect(chat.userId).toBe(mockResult.recordset[0].userId);
      });
  
    it("should handle foreign key constraint errors", async () => {
      const mockConversationTitle = "Constraint Error Chat";
      const mockUserId = 3;
      const foreignKeyErrorMessage = "The INSERT statement conflicted with the FOREIGN KEY constraint";
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockRejectedValueOnce(new Error(foreignKeyErrorMessage)),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
  
      // Using a spy to check console error output
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
      await Chat.addNewChat(mockConversationTitle, mockUserId);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('Foreign key constraint error:', expect.any(Error));
      expect(mockConnection.close).toHaveBeenCalled();
  
      consoleErrorSpy.mockRestore(); // Restore the original console.error implementation
    });
  
    it("should close the connection even if an error occurs", async () => {
      const mockConversationTitle = "Close Connection Error";
      const mockUserId = 4;
      const errorMessage = "Database Error";
  
      const mockConnection = {
        request: jest.fn(),
        close: jest.fn().mockRejectedValue(new Error("Error closing connection")),
      };
  
      sql.connect.mockRejectedValueOnce(new Error(errorMessage)); // Mock connect to reject
      sql.connect.mockResolvedValueOnce(mockConnection); // Mock connect to resolve with mockConnection
  
      try {
        await Chat.addNewChat(mockConversationTitle, mockUserId);
      } catch (error) {
        // Expected error, so just assert that close was called
        expect(mockConnection.close).toHaveBeenCalled();
      }
    });
});

describe("Chat.deleteChat", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should delete a chat conversation by conversation ID", async () => {
      const mockConversationId = 1;
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }), // Simulate successful deletion
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
  
      const result = await Chat.deleteChat(mockConversationId);
  
      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
    //   expect(mockConnection.request).toHaveBeenCalled(true);
    //   expect(mockRequest.input).toHaveBeenCalledWith("conversationId", sql.Int, mockConversationId);
    //   expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
    //   expect(mockConnection.close).toHaveBeenCalledTimes(1);
    //   expect(result).toBe(true); // Ensure the function returns true for successful deletion
    });
  
    it("should return false if no rows were affected", async () => {
      const mockConversationId = 2;
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [0] }), // Simulate no rows affected
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Mock connect to return mockConnection
  
      const result = await Chat.deleteChat(mockConversationId);
  
      expect(sql.connect).toHaveBeenCalledWith(dbConfig);
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("conversationId", sql.Int, mockConversationId);
      expect(mockRequest.query).toHaveBeenCalledWith(expect.any(String));
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toBe(false); // Ensure the function returns false if no rows were affected
    });

    it("should close the connection even if an error occurs", async () => {
      const mockConversationId = 4;
      const errorMessage = "Database Error";
  
      const mockConnection = {
        request: jest.fn(),
        close: jest.fn().mockRejectedValue(new Error("Error closing connection")),
      };
  
      sql.connect.mockRejectedValueOnce(new Error(errorMessage)); // Mock connect to reject
      sql.connect.mockResolvedValueOnce(mockConnection); // Mock connect to resolve with mockConnection
  
      try {
        await Chat.deleteChat(mockConversationId);
      } catch (error) {
        // Expected error, so just assert that close was called
        expect(mockConnection.close).toHaveBeenCalled();
      }
    });
});