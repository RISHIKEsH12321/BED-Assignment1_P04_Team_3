const sql = require("mssql");
const Industry_Challenges = require("../models/industry_challenges");

jest.mock("mssql", () => {
  return {
    connect: jest.fn(),
  };
});
/**/ 
describe("Industry_Challenges.getAllIndustryChallenges", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all industry challenges from the database", async () => {
    const mockChallenges = [
      {
        challenge_id: 2,
        industry_id: 1,
        challenge_name: "Labor Shortages",
        challenge_description: "Addressing the issue of insufficient labor in agriculture.",
        challenge_content: "Challenges include attracting young people to farming, mechanization, and improving labor conditions.",
      },
      {
        challenge_id: 3,
        industry_id: 1,
        challenge_name: "Market Access",
        challenge_description: "Ensuring farmers have access to markets to sell their produce.",
        challenge_content: "Challenges include transportation infrastructure, market information systems, and negotiating fair prices.",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordsets: [mockChallenges] }), // Note the use of recordsets
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const challenges = await Industry_Challenges.getAllIndustryChallenges();
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.request).toHaveBeenCalled();
    expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Industry_Challenges");
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(challenges[0]).toHaveLength(2); // Access the first recordset and check its length
    expect(challenges[0]).toEqual(mockChallenges); // Ensure it matches the mock data
  });

  it("should handle errors when retrieving all industry challenges", async () => {
    const errorMessage = "Database Error";
    
    // Mock the connection and request
    const mockRequest = {
      query: jest.fn().mockRejectedValue(new Error(errorMessage)),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockRejectedValue(new Error("Close connection error")), // Simulate error on close
    };

    // Mock sql.connect to return the mock connection
    sql.connect.mockResolvedValue(mockConnection);

    // Expect getAllIndustryChallenges to throw an error
    await expect(Industry_Challenges.getAllIndustryChallenges()).rejects.toThrow(errorMessage);

    // Check if sql.connect was called with the correct configuration
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));

    // Verify that request.query was called
    expect(mockConnection.request).toHaveBeenCalled();
    expect(mockRequest.query).toHaveBeenCalledWith(
      "SELECT * FROM Industry_Challenges"
    );

    // Verify that connection.close is called even when an error occurs
    expect(mockConnection.close).toHaveBeenCalled();
  });

});

describe("Industry_Challenges.getIndustryChallenges", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should retrieve all industry challenges for a specific industry id from the database", async () => {
      const industryId = 1;
      const mockChallenges = [
        {
          challenge_id: 2,
          industry_id: 1,
          challenge_name: "Labor Shortages",
          challenge_description: "Addressing the issue of insufficient labor in agriculture.",
          challenge_content: "Challenges include attracting young people to farming, mechanization, and improving labor conditions.",
        },
        {
          challenge_id: 3,
          industry_id: 1,
          challenge_name: "Market Access",
          challenge_description: "Ensuring farmers have access to markets to sell their produce.",
          challenge_content: "Challenges include transportation infrastructure, market information systems, and negotiating fair prices.",
        },
      ];
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock input method to return itself for chaining
        query: jest.fn().mockResolvedValue({ recordsets: [mockChallenges] }),
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const challenges = await Industry_Challenges.getIndustryChallenges(industryId);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("id", industryId); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Industry_Challenges WHERE industry_id = @id");
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(challenges[0]).toHaveLength(2); // Access the first recordset and check its length
      expect(challenges[0]).toEqual(mockChallenges); // Ensure it matches the mock data
    });
  
    it("should handle errors when retrieving industry challenges", async () => {
        const industryId = 1;
        const errorMessage = "Database Error";
        
        // Mock the connection and request
        const mockRequest = {
          input: jest.fn().mockReturnThis(),
          query: jest.fn().mockRejectedValue(new Error(errorMessage)),
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockRejectedValue(new Error("Close connection error")), // Simulate error on close
        };
    
        // Mock sql.connect to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    
        // Expect getIndustryChallenges to throw an error
        await expect(Industry_Challenges.getIndustryChallenges(industryId)).rejects.toThrow(errorMessage);
    
        // Check if sql.connect was called with the correct configuration
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    
        // Verify that request.input and request.query were called
        expect(mockConnection.request).toHaveBeenCalled();
        expect(mockRequest.input).toHaveBeenCalledWith("id", industryId);
        expect(mockRequest.query).toHaveBeenCalledWith(
          "SELECT * FROM Industry_Challenges WHERE industry_id = @id"
        );
        expect(mockConnection.close).toHaveBeenCalled();
      });
    
  
    it("should return an empty array for an invalid industry id", async () => {
      const invalidIndustryId = 999;
      const mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock input method to return itself for chaining
        query: jest.fn().mockResolvedValue({ recordsets: [[]] }), // Return an empty recordset for the invalid ID
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const challenges = await Industry_Challenges.getIndustryChallenges(invalidIndustryId);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("id", invalidIndustryId); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Industry_Challenges WHERE industry_id = @id");
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(challenges[0]).toHaveLength(0); // Expect an empty array
    });
});


describe("Industry_Challenges.createNewChallenge", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("should create a new challenge in the database", async () => {
      const newChallenge = {
        id: 3,
        name: "POST challenge Test",
        description: "POST challenge Test",
        content: "POST challenge Test",
      };
  
      const mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock input method to return itself for chaining
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }), // Mock successful insertion
      };
      const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
      };
  
      sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
  
      const result = await Industry_Challenges.createNewChallenge(newChallenge);
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
      expect(mockConnection.request).toHaveBeenCalled();
      expect(mockRequest.input).toHaveBeenCalledWith("id", newChallenge.id); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("name", newChallenge.name); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("description", newChallenge.description); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("content", newChallenge.content); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith(
        "INSERT INTO Industry_Challenges (industry_id, challenge_name, challenge_description, challenge_content) VALUES (@id, @name, @description, @content)"
      );
      expect(mockConnection.close).toHaveBeenCalledTimes(1);
      expect(result).toEqual([1]); // Ensure rowsAffected matches the mock data
    });
  
    it("should handle errors when creating a new challenge with an invalid industry ID", async () => {
        const invalidChallenge = {
          id: 9999, // Assume this ID is invalid or does not exist in the database
          name: "Invalid Challenge Test",
          description: "This challenge has an invalid industry ID",
          content: "The industry ID provided does not exist in the database.",
        };
    
        const mockRequest = {
          input: jest.fn().mockReturnThis(), // Mock input method to return itself for chaining
          query: jest.fn().mockRejectedValue(new Error("Invalid industry_id or other database error")), // Mock error response
        };
        const mockConnection = {
          request: jest.fn().mockReturnValue(mockRequest),
          close: jest.fn().mockResolvedValue(undefined),
        };
    
        sql.connect.mockResolvedValue(mockConnection); // Return the mock connection
    
        try {
          await Industry_Challenges.createNewChallenge(invalidChallenge);
        } catch (e) {
          expect(e.message).toBe("Invalid industry_id or other database error");
        }
    
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.request).toHaveBeenCalled();
        expect(mockRequest.input).toHaveBeenCalledWith("id", invalidChallenge.id);
        expect(mockRequest.input).toHaveBeenCalledWith("name", invalidChallenge.name);
        expect(mockRequest.input).toHaveBeenCalledWith("description", invalidChallenge.description);
        expect(mockRequest.input).toHaveBeenCalledWith("content", invalidChallenge.content);
        expect(mockRequest.query).toHaveBeenCalledWith(
          "INSERT INTO Industry_Challenges (industry_id, challenge_name, challenge_description, challenge_content) VALUES (@id, @name, @description, @content)"
        );
        expect(mockConnection.close).toHaveBeenCalledTimes(1); // Ensure close is called even in case of an error
      });    

    it("should handle errors when creating a new challenge", async () => {
      const newChallenge = {
        id: 3,
        name: "POST challenge Test",
        description: "POST challenge Test",
        content: "POST challenge Test",
      };
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage));
      await expect(Industry_Challenges.createNewChallenge(newChallenge)).rejects.toThrow(errorMessage);
    });
});


describe("Industry_Challenges.updateChallenge", () => {
    let mockConnection;
    let mockRequest;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      // Define the mockRequest and mockConnection
      mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock input method for chaining
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] }), // Mock successful query result
      };
  
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest), // Mock request method
        close: jest.fn().mockResolvedValue(undefined), // Mock close method
      };
  
      sql.connect = jest.fn().mockResolvedValue(mockConnection); // Mock sql.connect method
    });
  
    it("should update a challenge successfully", async () => {
      const newChallenge = {
        challenge_id: 10,
        challenge_name: "PUT challenge Test",
        challenge_description: "PUT challenge Test",
        challenge_content: "PUT challenge Test",
      };
  
      const result = await Industry_Challenges.updateChallenge(newChallenge);
      
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
      expect(mockConnection.request).toHaveBeenCalled(); // Ensure request is called
      expect(mockRequest.input).toHaveBeenCalledWith("name", newChallenge.challenge_name); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("description", newChallenge.challenge_description); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("content", newChallenge.challenge_content); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("challenge_id", newChallenge.challenge_id); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Industry_Challenges SET")); // Check query contains the update statement
      expect(result).toEqual([1]); // Check that rowsAffected is [1]
      expect(mockConnection.close).toHaveBeenCalled(); // Ensure connection close is called
    });

    it("should handle errors when updating a challenge with an invalid challenge ID", async () => {
        const invalidChallenge = {
          challenge_id: 9999, // Assume this ID is invalid or does not exist in the database
          challenge_name: "Invalid PUT challenge Test",
          challenge_description: "Invalid PUT challenge Test",
          challenge_content: "Invalid PUT challenge Test",
        };
    
        // Simulate a case where no rows are affected (e.g., invalid ID)
        mockRequest.query.mockResolvedValue({ rowsAffected: [0] }); // Mock query result for no rows affected
    
        // Expect updateChallenge to handle the scenario gracefully
        const result = await Industry_Challenges.updateChallenge(invalidChallenge);
    
        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
        expect(mockConnection.request).toHaveBeenCalled(); // Ensure request is called
        expect(mockRequest.input).toHaveBeenCalledWith("name", invalidChallenge.challenge_name); // Check input parameter
        expect(mockRequest.input).toHaveBeenCalledWith("description", invalidChallenge.challenge_description); // Check input parameter
        expect(mockRequest.input).toHaveBeenCalledWith("content", invalidChallenge.challenge_content); // Check input parameter
        expect(mockRequest.input).toHaveBeenCalledWith("challenge_id", invalidChallenge.challenge_id); // Check input parameter
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Industry_Challenges SET")); // Check query contains the update statement
        expect(result).toEqual([0]); // Verify no rows were affected
        expect(mockConnection.close).toHaveBeenCalled(); // Ensure connection close is called
      });
    
  
    it("should handle errors when updating a challenge", async () => {
      const newChallenge = {
        challenge_id: 10,
        challenge_name: "PUT challenge Test",
        challenge_description: "PUT challenge Test",
        challenge_content: "PUT challenge Test",
      };
  
      const errorMessage = "Database Error";
      mockRequest.query.mockRejectedValue(new Error(errorMessage)); // Mock query to throw an error
  
      await expect(Industry_Challenges.updateChallenge(newChallenge)).rejects.toThrow(errorMessage);
  
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
      expect(mockConnection.request).toHaveBeenCalled(); // Ensure request is called
      expect(mockRequest.input).toHaveBeenCalledWith("name", newChallenge.challenge_name); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("description", newChallenge.challenge_description); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("content", newChallenge.challenge_content); // Check input parameter
      expect(mockRequest.input).toHaveBeenCalledWith("challenge_id", newChallenge.challenge_id); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Industry_Challenges SET")); // Check query contains the update statement
      expect(mockConnection.close).toHaveBeenCalled(); // Ensure connection close is called
    });
});
 

describe("Industry_Challenges.deleteIndustryChallenge", () => {
    let mockConnection;
    let mockRequest;
  
    beforeEach(() => {
      jest.clearAllMocks();
  
      // Define the mockRequest and mockConnection
      mockRequest = {
        input: jest.fn().mockReturnThis(), // Mock input method for chaining
        query: jest.fn(), // Mock query method
      };
  
      mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest), // Mock request method
        close: jest.fn().mockResolvedValue(undefined), // Mock close method
      };
  
      sql.connect = jest.fn().mockResolvedValue(mockConnection); // Mock sql.connect method
    });
  
    it("should delete a challenge successfully", async () => {
      const challengeId = 1;
      mockRequest.query.mockResolvedValue({ rowsAffected: [1] }); // Simulate successful deletion with one row affected
  
      const result = await Industry_Challenges.deleteIndustryChallenge(challengeId);
  
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
      expect(mockConnection.request).toHaveBeenCalled(); // Ensure request is called
      expect(mockRequest.input).toHaveBeenCalledWith("id", challengeId); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith("DELETE FROM Industry_Challenges WHERE challenge_id = @id"); // Check query
      expect(result).toEqual([1]); // Verify that one row was affected
      expect(mockConnection.close).toHaveBeenCalled(); // Ensure connection close is called
    });
  
    it("should handle invalid challenge ID (no rows affected)", async () => {
      const invalidChallengeId = 9999;
      mockRequest.query.mockResolvedValue({ rowsAffected: [0] }); // Simulate no rows affected
  
      const result = await Industry_Challenges.deleteIndustryChallenge(invalidChallengeId);
  
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
      expect(mockConnection.request).toHaveBeenCalled(); // Ensure request is called
      expect(mockRequest.input).toHaveBeenCalledWith("id", invalidChallengeId); // Check input parameter
      expect(mockRequest.query).toHaveBeenCalledWith("DELETE FROM Industry_Challenges WHERE challenge_id = @id"); // Check query
      expect(result).toEqual([0]); // Verify no rows were affected
      expect(mockConnection.close).toHaveBeenCalled(); // Ensure connection close is called
    });
  
    it("should handle database errors", async () => {
      const errorMessage = "Database Error";
      sql.connect.mockRejectedValue(new Error(errorMessage)); // Simulate connection error
  
      await expect(Industry_Challenges.deleteIndustryChallenge(1)).rejects.toThrow(errorMessage); // Expect the error to be thrown
  
      expect(sql.connect).toHaveBeenCalledWith(expect.any(Object)); // Check connection is called with correct config
      expect(mockConnection.request).not.toHaveBeenCalled(); // Ensure request is not called
      expect(mockConnection.close).not.toHaveBeenCalled(); // Ensure connection close is not called
    });
});
  
