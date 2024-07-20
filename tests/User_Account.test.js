const User_Account = require("../models/User_Account");
const sql = require("mssql");

jest.mock("mssql");

describe("User_Account Model", () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn(),
        };

        mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("userlogin", () => {
        it("should return a user when credentials are correct", async () => {
        const mockResult = {
            recordset: [
            {
                user_id: 1,
                username: "testuser",
                user_email: "test@example.com",
                user_phonenumber: "1234567890",
                user_password: "hashedpassword",
                user_role: "user",
            },
            ],
        };

        mockRequest.query.mockResolvedValue(mockResult);

        const user = await User_Account.userlogin("testuser", "hashedpassword");

        expect(user).toEqual(mockResult.recordset[0]);
        expect(mockRequest.input).toHaveBeenCalledWith("username", sql.VarChar, "testuser");
        expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account WHERE username = @username");
        });

        it("should return null when credentials are incorrect", async () => {
        mockRequest.query.mockResolvedValue({ recordset: [] });

        const user = await User_Account.userlogin("wronguser", "wrongpassword");

        expect(user).toBeNull();
        });
    });

    describe("getUserById", () => {
        it("should return a user when user exists", async () => {
        const mockResult = {
            recordset: [
            {
                user_id: 1,
                username: "testuser",
                user_email: "test@example.com",
                user_phonenumber: "1234567890",
                user_password: "hashedpassword",
                user_role: "user",
            },
            ],
        };

        mockRequest.query.mockResolvedValue(mockResult);

        const user = await User_Account.getUserById(1);

        expect(user).toEqual(
            new User_Account(
            1,
            "testuser",
            "test@example.com",
            "1234567890",
            "hashedpassword",
            "user"
            )
        );
        expect(mockRequest.input).toHaveBeenCalledWith("user_id", 1);
        expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account WHERE user_id = @user_id");
        });

        it("should return null when user does not exist", async () => {
        mockRequest.query.mockResolvedValue({ recordset: [] });

        const user = await User_Account.getUserById(999);

        expect(user).toBeNull();
        });
    });

    describe("createAccount", () => {
        it("should create a new user account and return the user", async () => {
          const newUserData = {
            username: "newuser",
            user_email: "newuser@example.com",
            user_phonenumber: "1234567890",
            user_password: "hashedpassword",
            user_role: "user",
          };
    
          const mockUserResult = {
            recordset: [{ user_id: 1 }],
          };
    
          const mockProfileResult = {
            recordset: [{ profile_id: 1 }],
          };
    
          const mockUser = new User_Account(
            1,
            "newuser",
            "newuser@example.com",
            "1234567890",
            "hashedpassword",
            "user"
          );
    
          mockRequest.query
            .mockResolvedValueOnce(mockUserResult) // First query for inserting user
            .mockResolvedValueOnce(mockProfileResult) // Second query for inserting profile
            .mockResolvedValueOnce({ recordset: [mockUser] }); // Third query for getting user by ID
    
          const user = await User_Account.createAccount(newUserData);
    
          expect(mockRequest.input).toHaveBeenCalledWith("username", newUserData.username);
          expect(mockRequest.input).toHaveBeenCalledWith("user_email", newUserData.user_email);
          expect(mockRequest.input).toHaveBeenCalledWith("user_phonenumber", newUserData.user_phonenumber);
          expect(mockRequest.input).toHaveBeenCalledWith("user_password", newUserData.user_password);
          expect(mockRequest.input).toHaveBeenCalledWith("user_role", newUserData.user_role || "user");
    
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO User_Account"));
    
          expect(mockRequest.input).toHaveBeenCalledWith("user_id", 1);
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Profile"));
    
          expect(user).toEqual(mockUser);
        });

        it("should handle errors during user creation and return an appropriate error message", async () => {
            const newUserData = {
              username: "newuser",
              user_email: "newuser@example.com",
              user_phonenumber: "1234567890",
              user_password: "hashedpassword",
              user_role: "user",
            };
      
            // Simulate a database error
            mockRequest.query.mockRejectedValueOnce(new Error("Database error"));
      
            // Adjust the implementation of createAccount to handle and return errors appropriately
            try {
              await User_Account.createAccount(newUserData);
            } catch (error) {
              expect(error).toEqual(new Error("Database error"));
            }
        });
    });

    describe("updateUser", () => {
        it("should update user data and return the updated user", async () => {
          const userId = 1;
          const currentUserData = {
            user_id: userId,
            username: "currentuser",
            user_email: "current@example.com",
            user_phonenumber: "1234567890",
            user_password: "currenthashedpassword",
            user_role: "user",
          };
    
          const newUserData = {
            username: "updateduser",
            user_email: "updated@example.com",
            user_phonenumber: "0987654321",
            user_password: "updatedhashedpassword",
            user_role: "user",
          };
    
          const updatedUser = {
            user_id: userId,
            username: "updateduser",
            user_email: "updated@example.com",
            user_phonenumber: "0987654321",
            user_password: "updatedhashedpassword",
            user_role: "user",
          };
    
          // Mock the getUserById method to return the current user data
          User_Account.getUserById = jest.fn().mockResolvedValueOnce(currentUserData).mockResolvedValueOnce(updatedUser);
    
          // Mock the query method to resolve without returning anything meaningful for the update query
          mockRequest.query.mockResolvedValue({});
    
          const result = await User_Account.updateUser(userId, newUserData);
    
          // Check that the correct inputs were passed to the query
          expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
          expect(mockRequest.input).toHaveBeenCalledWith("username", newUserData.username);
          expect(mockRequest.input).toHaveBeenCalledWith("user_email", newUserData.user_email);
          expect(mockRequest.input).toHaveBeenCalledWith("user_phonenumber", newUserData.user_phonenumber);
          expect(mockRequest.input).toHaveBeenCalledWith("user_password", newUserData.user_password);
          expect(mockRequest.input).toHaveBeenCalledWith("user_role", newUserData.user_role);
    
          // Check that the query was called with the correct SQL
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE User_Account"));
    
          // Check that the getUserById method was called twice: once before the update and once after
          expect(User_Account.getUserById).toHaveBeenCalledTimes(2);
          expect(User_Account.getUserById).toHaveBeenCalledWith(userId);
    
          // Check that the result is the updated user
          expect(result).toEqual(updatedUser);
        });
    
        it("should handle missing newUserData fields by using current data", async () => {
          const userId = 1;
          const currentUserData = {
            user_id: userId,
            username: "currentuser",
            user_email: "current@example.com",
            user_phonenumber: "1234567890",
            user_password: "currenthashedpassword",
            user_role: "user",
          };
    
          const newUserData = {
            user_email: "updated@example.com", // Only updating email
          };
    
          const updatedUser = {
            user_id: userId,
            username: "currentuser",
            user_email: "updated@example.com",
            user_phonenumber: "1234567890",
            user_password: "currenthashedpassword",
            user_role: "user",
          };
    
          // Mock the getUserById method to return the current user data
          User_Account.getUserById = jest.fn().mockResolvedValueOnce(currentUserData).mockResolvedValueOnce(updatedUser);
    
          // Mock the query method to resolve without returning anything meaningful for the update query
          mockRequest.query.mockResolvedValue({});
    
          const result = await User_Account.updateUser(userId, newUserData);
    
          // Check that the correct inputs were passed to the query
          expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
          expect(mockRequest.input).toHaveBeenCalledWith("username", currentUserData.username);
          expect(mockRequest.input).toHaveBeenCalledWith("user_email", newUserData.user_email);
          expect(mockRequest.input).toHaveBeenCalledWith("user_phonenumber", currentUserData.user_phonenumber);
          expect(mockRequest.input).toHaveBeenCalledWith("user_password", currentUserData.user_password);
          expect(mockRequest.input).toHaveBeenCalledWith("user_role", currentUserData.user_role);
    
          // Check that the query was called with the correct SQL
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE User_Account"));
    
          // Check that the getUserById method was called twice: once before the update and once after
          expect(User_Account.getUserById).toHaveBeenCalledTimes(2);
          expect(User_Account.getUserById).toHaveBeenCalledWith(userId);
    
          // Check that the result is the updated user
          expect(result).toEqual(updatedUser);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user and return true when a user is deleted", async () => {
          const userId = 1;
    
          // Mock the result of the delete query to indicate one row was affected
          const mockResult = {
            rowsAffected: [1],
          };
    
          mockRequest.query.mockResolvedValue(mockResult);
    
          const result = await User_Account.deleteUser(userId);
    
          // Check that the correct input was passed to the query
          expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
    
          // Check that the query was called with the correct SQL
          expect(mockRequest.query).toHaveBeenCalledWith(
            expect.stringContaining("DELETE FROM User_Account WHERE user_id = @user_id")
          );
    
          // Check that the result is true
          expect(result).toBe(true);
        });
    
        it("should return false when no user is deleted", async () => {
          const userId = 999;
    
          // Mock the result of the delete query to indicate no rows were affected
          const mockResult = {
            rowsAffected: [0],
          };
    
          mockRequest.query.mockResolvedValue(mockResult);
    
          const result = await User_Account.deleteUser(userId);
    
          // Check that the correct input was passed to the query
          expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
    
          // Check that the query was called with the correct SQL
          expect(mockRequest.query).toHaveBeenCalledWith(
            expect.stringContaining("DELETE FROM User_Account WHERE user_id = @user_id")
          );
    
          // Check that the result is false
          expect(result).toBe(false);
        });
    });

    describe("userforgotpassword", () => {
        it("should return a user when the email exists", async () => {
          const userEmail = "test@example.com";
          const mockResult = {
            recordset: [
              {
                user_id: 1,
                username: "testuser",
                user_email: "test@example.com",
                user_phonenumber: "1234567890",
                user_password: "hashedpassword",
                user_role: "user",
              },
            ],
          };
    
          mockRequest.query.mockResolvedValue(mockResult);
    
          const user = await User_Account.userforgotpassword(userEmail);
    
          expect(mockRequest.input).toHaveBeenCalledWith("user_email", userEmail);
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM User_Account WHERE user_email = @user_email"));
    
          expect(user).toEqual(
            new User_Account(
              mockResult.recordset[0].user_id,
              mockResult.recordset[0].username,
              mockResult.recordset[0].user_email,
              mockResult.recordset[0].user_phonenumber,
              mockResult.recordset[0].user_password,
              mockResult.recordset[0].user_role
            )
          );
        });
    
        it("should return null when the email does not exist", async () => {
          const userEmail = "nonexistent@example.com";
          mockRequest.query.mockResolvedValue({ recordset: [] });
    
          const user = await User_Account.userforgotpassword(userEmail);
    
          expect(mockRequest.input).toHaveBeenCalledWith("user_email", userEmail);
          expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM User_Account WHERE user_email = @user_email"));
    
          expect(user).toBeNull();
        });
    });
});
