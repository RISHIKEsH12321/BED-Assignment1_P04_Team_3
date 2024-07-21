const Admin_Account = require("../models/Admin_Account");
const sql = require("mssql");

jest.mock("mssql");

describe("Admin_Account Model", () => {
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

    describe("adminlogin", () => {
        it("should return an admin when credentials are correct", async () => {
            const mockResult = {
                recordset: [
                    {
                        admin_id: 1,
                        username: "adminuser",
                        admin_email: "admin@example.com",
                        admin_phonenumber: "1234567890",
                        admin_password: "hashedpassword",
                        admin_role: "admin",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const admin = await Admin_Account.adminlogin("adminuser", "hashedpassword");

            expect(admin).toEqual(mockResult.recordset[0]);
            expect(mockRequest.input).toHaveBeenCalledWith("username", sql.VarChar, "adminuser");
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Admin_Account WHERE username = @username");
        });

        it("should return null when credentials are incorrect", async () => {
            mockRequest.query.mockResolvedValue({ recordset: [] });

            const admin = await Admin_Account.adminlogin("wrongadmin", "wrongpassword");

            expect(admin).toBeNull();
        });
    });

    describe("getAllUsers", () => {
        it("should return all Users from the database", async () => {
            const mockResult = {
                recordset: [
                    {
                        admin_id: 1,
                        user_id: 1,
                        username: "adminuser1",
                        user_email: "admin1@example.com",
                        user_phonenumber: "1234567890",
                        user_password: "hashedpassword1",
                        user_role: "admin",
                    },
                    {
                        user_id: 2,
                        username: "adminuser2",
                        user_email: "admin2@example.com",
                        user_phonenumber: "0987654321",
                        user_password: "hashedpassword2",
                        user_role: "admin",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const admins = await Admin_Account.getAllUsers();

            const expectedAdmins = mockResult.recordset.map(row => 
                new Admin_Account(
                    row.admin_id, 
                    row.user_id, 
                    row.username, 
                    row.user_email, 
                    row.user_phonenumber, 
                    row.user_password, 
                    row.user_role
                )
            );

            expect(admins).toEqual(expectedAdmins);
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account"); // Ensure the correct SQL query is used
        });

        it("should return an empty array when no users are found", async () => {
            // Mock result with an empty recordset
            const mockResult = {
                recordset: []
            };
    
            mockRequest.query.mockResolvedValue(mockResult);
    
            const admins = await Admin_Account.getAllUsers();
    
            // Expect an empty array since no users are found
            expect(admins).toEqual([]);
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account"); // Ensure the correct SQL query is used
        });
    });

    describe("getUserById", () => {
        it("should return the user when a user exists", async () => {
            const userId = 1;
            const mockResult = {
                recordset: [
                    {
                        admin_id: 1,
                        user_id: userId,
                        username: "adminuser1",
                        user_email: "admin1@example.com",
                        user_phonenumber: "1234567890",
                        user_password: "hashedpassword1",
                        user_role: "admin",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const user = await Admin_Account.getUserById(userId);

            const expectedUser = new Admin_Account(
                1,
                userId,
                "adminuser1",
                "admin1@example.com",
                "1234567890",
                "hashedpassword1",
                "admin"
            );

            expect(user).toEqual(expectedUser);
            expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account WHERE user_id = @user_id");
        });

        it("should return null when no user exists", async () => {
            const userId = 999;
            const mockResult = {
                recordset: []
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const user = await Admin_Account.getUserById(userId);

            expect(user).toBeNull();
            expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM User_Account WHERE user_id = @user_id");
        });
    });

    describe("AdmincreateAccount", () => {
        const newUserData = {
            username: "newadmin",
            user_email: "newadmin@example.com",
            user_phonenumber: "1234567890",
            user_password: "hashedpassword",
            user_role: "admin",
        };
        const securityCode = "VALID_SECURITY_CODE";
    
        it("should create a new admin account successfully", async () => {
            const mockCodeCheckResult = { recordset: [{ code_id: 1 }] };
            const mockUserInsertResult = { recordset: [{ user_id: 1 }] };
            const mockAdminInsertResult = { recordset: [{ admin_id: 1 }] };
        
            // Mock getUserById to return a valid result
            const mockGetUserByIdResult = new Admin_Account(
                1,
                1,
                "newadmin",
                "newadmin@example.com",
                "1234567890",
                "hashedpassword",
                "admin"
            );
        
            // Spy on getUserById method
            jest.spyOn(Admin_Account, 'getUserById').mockResolvedValue(mockGetUserByIdResult);
        
            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockCodeCheckResult)) // check code
                .mockImplementationOnce(() => Promise.resolve(mockUserInsertResult)) // insert user
                .mockImplementationOnce(() => Promise.resolve()) // update code
                .mockImplementationOnce(() => Promise.resolve(mockAdminInsertResult)) // insert admin
                .mockImplementationOnce(() => Promise.resolve()); // insert profile
        
            const user = await Admin_Account.AdmincreateAccount(newUserData, securityCode);
        
            expect(user).toBeDefined(); // Ensure that the result is defined
            expect(user).toEqual(mockGetUserByIdResult); // Ensure that the result matches the mocked value
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT code_id FROM Codes"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Codes"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Admin_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Profile"));
        });
    
        it("should throw an error when security code is invalid", async () => {
            mockRequest.query.mockResolvedValueOnce({ recordset: [] }); // check code
    
            await expect(Admin_Account.AdmincreateAccount(newUserData, securityCode))
                .rejects.toThrow("Invalid security code or already used.");
        });
    
        it("should handle database errors during user creation", async () => {
            const mockCodeCheckResult = { recordset: [{ code_id: 1 }] };
    
            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockCodeCheckResult)) // check code
                .mockImplementationOnce(() => Promise.reject(new Error("Database error"))); // insert user
    
            await expect(Admin_Account.AdmincreateAccount(newUserData, securityCode))
                .rejects.toThrow("Database error");
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT code_id FROM Codes"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO User_Account"));
        });
    
        it("should handle errors when updating the Codes table", async () => {
            const mockCodeCheckResult = { recordset: [{ code_id: 1 }] };
            const mockUserInsertResult = { recordset: [{ user_id: 1 }] };
    
            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockCodeCheckResult)) // check code
                .mockImplementationOnce(() => Promise.resolve(mockUserInsertResult)) // insert user
                .mockImplementationOnce(() => Promise.reject(new Error("Database error"))); // update code
    
            await expect(Admin_Account.AdmincreateAccount(newUserData, securityCode))
                .rejects.toThrow("Database error");
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Codes"));
        });
    });

    describe("AdminupdateUser", () => {
        it("should update user details and admin details successfully when the user is an admin", async () => {
            const userId = 1;
            const newUserData = {
                username: "updatedAdmin",
                user_email: "updatedadmin@example.com",
                user_phonenumber: "0987654321",
                user_password: "newhashedpassword",
            };

            const mockRoleResult = { recordset: [{ user_role: 'admin' }] };
            const mockUserUpdateResult = {}; // No result returned
            const mockAdminUpdateResult = {}; // No result returned

            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockRoleResult)) // Get user role
                .mockImplementationOnce(() => Promise.resolve(mockUserUpdateResult)) // Update User_Account
                .mockImplementationOnce(() => Promise.resolve(mockAdminUpdateResult)); // Update Admin_Account

            const user = await Admin_Account.AdminupdateUser(userId, newUserData);

            expect(user).toBeDefined(); // Assuming getUserById returns the updated user
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Admin_Account"));
        });

        it("should update user details successfully when the user is not an admin", async () => {
            const userId = 2;
            const newUserData = {
                username: "updatedUser",
                user_email: "updateduser@example.com",
                user_phonenumber: "1234567890",
                user_password: "newhashedpassword",
            };

            const mockRoleResult = { recordset: [{ user_role: 'user' }] };
            const mockUserUpdateResult = {}; // No result returned

            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockRoleResult)) // Get user role
                .mockImplementationOnce(() => Promise.resolve(mockUserUpdateResult)); // Update User_Account

            const user = await Admin_Account.AdminupdateUser(userId, newUserData);

            expect(user).toBeDefined(); // Assuming getUserById returns the updated user
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE User_Account"));
            expect(mockRequest.query).not.toHaveBeenCalledWith(expect.stringContaining("UPDATE Admin_Account"));
        });

        it("should handle database errors during user update", async () => {
            const userId = 1;
            const newUserData = {
                username: "errorUser",
            };

            const mockRoleResult = { recordset: [{ user_role: 'user' }] };

            mockRequest.query
                .mockImplementationOnce(() => Promise.resolve(mockRoleResult)) // Get user role
                .mockImplementationOnce(() => Promise.reject(new Error("Database error"))); // Update User_Account

            await expect(Admin_Account.AdminupdateUser(userId, newUserData)).rejects.toThrow("Database error");

            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE User_Account"));
        });
    });

    describe("AdmindeleteUser", () => {
        it("should return false if the user does not exist", async () => {
            const userId = 999; // Assume this user does not exist
            const mockResult = { recordset: [] };
    
            mockRequest.query.mockResolvedValue(mockResult);
    
            const result = await Admin_Account.AdmindeleteUser(userId);
            expect(result).toBe(false);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
        });
    
        it("should return false if the user is an admin", async () => {
            const userId = 1; // Assume this user is an admin
            const mockResult = { recordset: [{ user_role: 'admin' }] };
    
            mockRequest.query
                .mockResolvedValueOnce(mockResult) // For SELECT user_role query
                .mockResolvedValue({}) // For DELETE Profile query
                .mockResolvedValue({}); // For DELETE User_Account query
    
            const result = await Admin_Account.AdmindeleteUser(userId);
            expect(result).toBe(false);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
        });
    
        it("should successfully delete a user if the user exists and is not an admin", async () => {
            const userId = 2; // Assume this user exists and is not an admin
            const mockResult = { recordset: [{ user_role: 'user' }] };
            const deleteProfileResult = { rowsAffected: [1] };
            const deleteUserResult = { rowsAffected: [1] };
    
            mockRequest.query
                .mockResolvedValueOnce(mockResult) // For SELECT user_role query
                .mockResolvedValueOnce(deleteProfileResult) // For DELETE Profile query
                .mockResolvedValueOnce(deleteUserResult); // For DELETE User_Account query
    
            const result = await Admin_Account.AdmindeleteUser(userId);
            expect(result).toBe(true);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Profile"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM User_Account"));
        });
    
        it("should handle database errors during deletion", async () => {
            const userId = 3; // Assume this user exists
            const mockResult = { recordset: [{ user_role: 'user' }] };
    
            mockRequest.query
                .mockResolvedValueOnce(mockResult) // For SELECT user_role query
                .mockRejectedValueOnce(new Error("Database error")); // For DELETE Profile query
    
            await expect(Admin_Account.AdmindeleteUser(userId)).rejects.toThrow("Database error");
    
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT user_role FROM User_Account"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Profile"));
        });
    });

    describe("adminforgotpassword", () => {
        it("should return an Admin_Account instance when the user exists", async () => {
            const userEmail = "admin@example.com";
            const mockResult = {
                recordset: [
                    {
                        admin_id: 1,
                        user_id: 1,
                        username: "adminuser",
                        user_email: userEmail,
                        user_phonenumber: "1234567890",
                        user_password: "hashedpassword",
                        user_role: "admin",
                    },
                ],
            };
    
            mockRequest.query.mockResolvedValue(mockResult);
    
            const admin = await Admin_Account.adminforgotpassword(userEmail);
    
            const expectedAdmin = new Admin_Account(
                1,
                1,
                "adminuser",
                userEmail,
                "1234567890",
                "hashedpassword",
                "admin"
            );
    
            expect(admin).toEqual(expectedAdmin);
            expect(mockRequest.input).toHaveBeenCalledWith('user_email', userEmail);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Admin_Account WHERE user_email = @user_email"));
        });
    
        it("should return null when the user does not exist", async () => {
            const userEmail = "nonexistent@example.com";
            const mockResult = {
                recordset: [],
            };
    
            mockRequest.query.mockResolvedValue(mockResult);
    
            const admin = await Admin_Account.adminforgotpassword(userEmail);
    
            expect(admin).toBeNull();
            expect(mockRequest.input).toHaveBeenCalledWith('user_email', userEmail);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Admin_Account WHERE user_email = @user_email"));
        });
    
        it("should handle database errors", async () => {
            const userEmail = "error@example.com";
    
            mockRequest.query.mockRejectedValue(new Error("Database error"));
    
            await expect(Admin_Account.adminforgotpassword(userEmail)).rejects.toThrow("Database error");
    
            expect(mockRequest.input).toHaveBeenCalledWith('user_email', userEmail);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Admin_Account WHERE user_email = @user_email"));
        });
    });
});