const adminController = require("../controller/Admin_Account_Controller");
const Admin_Account = require("../models/Admin_Account");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRole = require("../middleware/validateRole");

jest.mock("../models/Admin_Account");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../middleware/validateRole")

describe("Admin Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("adminLogin", () => {
        it("should return a token and admin_id for valid login", async () => {
            const req = {
                body: {
                    username: "adminuser",
                    user_password: "adminpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockAdmin = {
                admin_id: 1,
                username: "adminuser",
                user_password: await bcryptjs.hash("adminpassword", 10)
            };

            // Ensure the method is mocked correctly
            Admin_Account.adminlogin = jest.fn().mockResolvedValue(mockAdmin);
            bcryptjs.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake-jwt-token");

            await adminController.adminlogin(req, res);

            expect(Admin_Account.adminlogin).toHaveBeenCalledWith("adminuser");
            expect(bcryptjs.compare).toHaveBeenCalledWith("adminpassword", mockAdmin.password);
            expect(jwt.sign).toHaveBeenCalledWith({ admin_id: mockAdmin.admin_id, username: mockAdmin.username }, process.env.JWT_SECRET, { expiresIn: "3600s" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful",
                token: "fake-jwt-token",
                admin_id: mockAdmin.admin_id
            });
        });

        it("should return 401 for invalid login", async () => {
            const req = {
                body: {
                    username: "adminuser",
                    password: "wrongpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockAdmin = {
                admin_id: 1,
                username: "adminuser",
                password: await bcryptjs.hash("adminpassword", 10)
            };

            Admin_Account.adminlogin = jest.fn().mockResolvedValue(mockAdmin);
            bcryptjs.compare.mockResolvedValue(false);

            await adminController.adminlogin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
        });

        it("should return 500 for internal server error", async () => {
            const req = {
                body: {
                    username: "adminuser",
                    password: "adminpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            Admin_Account.adminlogin = jest.fn().mockRejectedValue(new Error("Internal server error"));

            await adminController.adminlogin(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe("getUserById", () => {
        it("should return user details for a valid user ID", async () => {
            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockUser = {
                admin_id: 1,
                username: "adminuser",
                user_email: "adminuser@example.com"
            };

            Admin_Account.getUserById = jest.fn().mockResolvedValue(mockUser);

            await adminController.getUserById(req, res);

            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it("should return 404 if user not found", async () => {
            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            Admin_Account.getUserById = jest.fn().mockResolvedValue(null);

            await adminController.getUserById(req, res);

            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("User not found");
        });

        it("should return 500 for internal server error", async () => {
            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            Admin_Account.getUserById = jest.fn().mockRejectedValue(new Error("Internal server error"));

            await adminController.getUserById(req, res);

            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error retrieving User");
        });
    });

    describe("getAllUsers", () => {
        it("should return a list of users for a successful retrieval", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockUsers = [
                { admin_id: 1, username: "user1", user_email: "user1@example.com" },
                { admin_id: 2, username: "user2", user_email: "user2@example.com" }
            ];

            Admin_Account.getAllUsers = jest.fn().mockResolvedValue(mockUsers);

            await adminController.getAllUsers(req, res);

            expect(Admin_Account.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it("should return an empty array if no users are found", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            // Mocking getAllUsers to return an empty array
            Admin_Account.getAllUsers = jest.fn().mockResolvedValue([]);
    
            await adminController.getAllUsers(req, res);
    
            expect(Admin_Account.getAllUsers).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it("should return 500 for internal server error", async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            Admin_Account.getAllUsers = jest.fn().mockRejectedValue(new Error("Internal server error"));

            await adminController.getAllUsers(req, res);

            expect(Admin_Account.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error retrieving users");
        });
    });

    describe("AdmincreateAccount", () => {
        it("should create a new account successfully", async () => {
            const req = {
                body: {
                    username: "newuser",
                    user_email: "newuser@example.com",
                    user_phonenumber: "1234567890",
                    user_password: "newpassword",
                    user_role: "admin",
                    security_code: "secure123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const hashedPassword = "hashedpassword";
            const newUserData = {
                username: "newuser",
                user_email: "newuser@example.com",
                user_phonenumber: "1234567890",
                user_password: hashedPassword,
                user_role: "admin"
            };
            const createdAccount = { admin_id: 1, ...newUserData };
    
            bcryptjs.genSalt.mockResolvedValue("salt");
            bcryptjs.hash.mockResolvedValue(hashedPassword);
            Admin_Account.AdmincreateAccount.mockResolvedValue(createdAccount);
    
            await adminController.AdmincreateAccount(req, res);
    
            expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
            expect(bcryptjs.hash).toHaveBeenCalledWith("newpassword", "salt");
            expect(Admin_Account.AdmincreateAccount).toHaveBeenCalledWith(newUserData, "secure123");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdAccount);
        });
    
        it("should return 400 for validation errors", async () => {
            const req = {
                body: {
                    username: "newuser",
                    user_email: "newuser@example.com",
                    user_phonenumber: "1234567890",
                    user_password: "newpassword",
                    user_role: "admin",
                    security_code: "secure123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            bcryptjs.genSalt.mockResolvedValue("salt");
            bcryptjs.hash.mockResolvedValue("hashedpassword");
            Admin_Account.AdmincreateAccount.mockRejectedValue(new Error("Validation error"));
    
            await adminController.AdmincreateAccount(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith("Validation error");
        });
    
        it("should return 500 for internal server error", async () => {
            const req = {
                body: {
                    username: "newuser",
                    user_email: "newuser@example.com",
                    user_phonenumber: "1234567890",
                    user_password: "newpassword",
                    user_role: "admin",
                    security_code: "secure123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            bcryptjs.genSalt.mockResolvedValue("salt");
            bcryptjs.hash.mockResolvedValue("hashedpassword");
            Admin_Account.AdmincreateAccount.mockRejectedValue(new Error("Internal server error"));
    
            await adminController.AdmincreateAccount(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error creating user");
        });
    });

    describe("AdminupdateUser", () => {
        it("should successfully update a user by admin", async () => {
            const req = {
                params: { id: "1" },
                body: {
                    user_id: 1,
                    username: "updateduser",
                    user_password: "newpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        
            const mockUser = {
                user_id: 1,
                username: "olduser",
                user_role: "user",
                user_password: await bcryptjs.hash("oldpassword", 10)
            };
        
            const updatedUser = {
                user_id: 1,
                username: "updateduser",
                user_role: "user",
                user_password: await bcryptjs.hash("newpassword", 10)
            };
        
            validateRole.validateRoleUsingToken.mockResolvedValue("admin");
            Admin_Account.getUserById.mockResolvedValue(mockUser);
            bcryptjs.genSalt.mockResolvedValue("salt");
            bcryptjs.hash.mockResolvedValue("newpassword");
            Admin_Account.AdminupdateUser.mockResolvedValue(updatedUser);
        
            await adminController.AdminupdateUser(req, res);
        
            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1);
            expect(bcryptjs.hash).toHaveBeenCalledWith("newpassword", "salt");
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, {
                user_id: 1,
                username: "updateduser",
                user_password: "newpassword"
            });
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should return 403 if admin tries to update another admin", async () => {
            const req = {
                params: { id: "2" },
                body: {
                    user_id: 1, // Admin trying to update another admin
                    username: "updatedadmin"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const mockAdmin = {
                admin_id: 2,
                user_role: "admin"
            };

            validateRole.validateRoleUsingToken.mockResolvedValue("admin");
            Admin_Account.getUserById.mockResolvedValue(mockAdmin);

            await adminController.AdminupdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith("Access denied. Admins cannot update other admin accounts.");
        });

        it("should successfully update a user by user", async () => {
            const req = {
                params: {
                    id: "1" // Ensure this matches the ID expected in the controller
                },
                body: {
                    user_id: 1,
                    username: "updateduser",
                    user_password: "newpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
        
            Admin_Account.getUserById = jest.fn().mockResolvedValue({
                user_id: 1,
                username: "currentuser",
                user_role: "user"
            });
            bcryptjs.hash = jest.fn().mockResolvedValue("hashedpassword");
            Admin_Account.AdminupdateUser = jest.fn().mockResolvedValue({
                user_id: 1,
                username: "updateduser",
                user_password: "hashedpassword"
            });
        
            await adminController.AdminupdateUser(req, res);
        
            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1);
            expect(bcryptjs.hash).toHaveBeenCalledWith("newpassword", expect.any(String));
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, {
                user_id: 1,
                username: "updateduser",
                user_password: "hashedpassword"
            });
        });
        

        it("should return 403 if user tries to update another user's profile", async () => {
            const req = {
                params: { id: "2" },
                body: {
                    user_id: 1 // User trying to update another user
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            validateRole.validateRoleUsingToken.mockResolvedValue("user");
            Admin_Account.getUserById.mockResolvedValue({
                admin_id: 2,
                user_role: "user"
            });

            await adminController.AdminupdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith("Access denied. You can only update your own profile.");
        });

        it('should return 404 if user to update is not found', async () => {
            // Arrange
            const req = {
                params: { id: '1' },
                body: { user_id: 1 }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
        
            // Mock implementations
            Admin_Account.getUserById.mockResolvedValue(null); // Simulate no user found with ID 1
            validateRole.validateRoleUsingToken = jest.fn().mockResolvedValue('admin'); // Ensure this returns 'admin'
            
            console.log('Before calling AdminupdateUser');
        
            // Act
            await adminController.AdminupdateUser(req, res);
        
            console.log('After calling AdminupdateUser');
            console.log('Calls to getUserById:', Admin_Account.getUserById.mock.calls);
        
            // Assert
            expect(Admin_Account.getUserById).toHaveBeenCalledWith(1); 
            expect(res.status).toHaveBeenCalledWith(404); 
            expect(res.send).toHaveBeenCalledWith("User not found"); 
        });

        it("should return 403 if role is not admin or user", async () => {
            const req = {
                params: { id: "1" },
                body: {
                    user_id: 1
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            validateRole.validateRoleUsingToken.mockResolvedValue("guest"); // Invalid role

            await adminController.AdminupdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith('Access denied. Admins only.');
        });

        it("should return 500 for internal server error", async () => {
            const req = {
                params: { id: "1" },
                body: {
                    user_id: 1
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            validateRole.validateRoleUsingToken.mockRejectedValue(new Error("Internal server error"));

            await adminController.AdminupdateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error updating User");
        });
    });

    describe('AdmindeleteUser', () => {
        it('should successfully delete a user', async () => {
            // Arrange
            const req = {
                params: { id: '1' } // The ID of the user to delete
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            Admin_Account.AdmindeleteUser.mockResolvedValue(true); // Simulate successful deletion

            // Act
            await adminController.AdmindeleteUser(req, res);

            // Assert
            expect(Admin_Account.AdmindeleteUser).toHaveBeenCalledWith(1); // Ensure the ID passed is 1
            expect(res.status).toHaveBeenCalledWith(204); // Ensure 204 No Content status is set
            expect(res.send).toHaveBeenCalled(); // Ensure send was called
        });

        it('should return 403 if user is not found or cannot delete admin', async () => {
            // Arrange
            const req = {
                params: { id: '1' } // The ID of the user to delete
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            Admin_Account.AdmindeleteUser.mockResolvedValue(false); // Simulate failure to delete

            // Act
            await adminController.AdmindeleteUser(req, res);

            // Assert
            expect(Admin_Account.AdmindeleteUser).toHaveBeenCalledWith(1); // Ensure the ID passed is 1
            expect(res.status).toHaveBeenCalledWith(403); // Ensure 403 Forbidden status is set
            expect(res.send).toHaveBeenCalledWith("User not found or cannot delete admin"); // Ensure the correct error message is sent
        });

        it('should return 500 if there is an internal server error', async () => {
            // Arrange
            const req = {
                params: { id: '1' } // The ID of the user to delete
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            Admin_Account.AdmindeleteUser.mockRejectedValue(new Error("Some error")); // Simulate an error

            // Act
            await adminController.AdmindeleteUser(req, res);

            // Assert
            expect(Admin_Account.AdmindeleteUser).toHaveBeenCalledWith(1); // Ensure the ID passed is 1
            expect(res.status).toHaveBeenCalledWith(500); // Ensure 500 Internal Server Error status is set
            expect(res.send).toHaveBeenCalledWith("Admin account cannot be deleted"); // Ensure the correct error message is sent
        });
    });

    describe('AdminupdateUserwithemail', () => {

        it('should successfully update user and hash password if provided', async () => {
            // Arrange
            const req = {
                params: { id: '1' }, // ID of the user to update
                body: { user_password: 'newpassword' } // New password to hash
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock implementations
            const hashedPassword = 'hashedpassword'; // Simulated hashed password
            bcryptjs.hash = jest.fn().mockResolvedValue(hashedPassword); // Mock bcrypt hash function
            const updatedUser = { id: 1, user_password: hashedPassword }; // Simulated updated user
            Admin_Account.AdminupdateUser.mockResolvedValue(updatedUser);

            // Act
            await adminController.AdminupdateUserwithemail(req, res);

            // Assert
            expect(bcryptjs.hash).toHaveBeenCalledWith('newpassword', expect.any(String)); // Ensure bcrypt hash was called with correct parameters
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, { user_password: hashedPassword }); // Ensure the correct data was passed
            expect(res.json).toHaveBeenCalledWith(updatedUser); // Ensure the updated user data was returned
        });

        it('should successfully update user without changing password', async () => {
            // Arrange
            const req = {
                params: { id: '1' }, // ID of the user to update
                body: { user_email: 'newemail@example.com' } // Data to update
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            // Mock implementations
            const updatedUser = { id: 1, user_email: 'newemail@example.com' }; // Simulated updated user
            Admin_Account.AdminupdateUser.mockResolvedValue(updatedUser);

            // Act
            await adminController.AdminupdateUserwithemail(req, res);

            // Assert
            expect(bcryptjs.hash).not.toHaveBeenCalled(); // Ensure bcrypt hash was not called
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, { user_email: 'newemail@example.com' }); // Ensure the correct data was passed
            expect(res.json).toHaveBeenCalledWith(updatedUser); // Ensure the updated user data was returned
        });

        it('should return 404 if user to update is not found', async () => {
            // Arrange
            const req = {
                params: { id: '1' }, // ID of the user to update
                body: { user_password: 'newpassword' } // New password to hash
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            bcryptjs.hash = jest.fn().mockResolvedValue('hashedpassword'); // Mock bcrypt hash function
            Admin_Account.AdminupdateUser.mockResolvedValue(null); // Simulate no user found

            // Act
            await adminController.AdminupdateUserwithemail(req, res);

            // Assert
            expect(bcryptjs.hash).toHaveBeenCalledWith('newpassword', expect.any(String)); // Ensure bcrypt hash was called with correct parameters
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, { user_password: 'hashedpassword' }); // Ensure the correct data was passed
            expect(res.status).toHaveBeenCalledWith(404); // Ensure 404 status is set
            expect(res.send).toHaveBeenCalledWith("User not found"); // Ensure the correct error message is sent
        });

        it('should return 500 if there is an internal server error', async () => {
            // Arrange
            const req = {
                params: { id: '1' }, // ID of the user to update
                body: { user_password: 'newpassword' } // New password to hash
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            bcryptjs.hash = jest.fn().mockResolvedValue('hashedpassword'); // Mock bcrypt hash function
            Admin_Account.AdminupdateUser.mockRejectedValue(new Error("Some error")); // Simulate an error

            // Act
            await adminController.AdminupdateUserwithemail(req, res);

            // Assert
            expect(bcryptjs.hash).toHaveBeenCalledWith('newpassword', expect.any(String)); // Ensure bcrypt hash was called with correct parameters
            expect(Admin_Account.AdminupdateUser).toHaveBeenCalledWith(1, { user_password: 'hashedpassword' }); // Ensure the correct data was passed
            expect(res.status).toHaveBeenCalledWith(500); // Ensure 500 Internal Server Error status is set
            expect(res.send).toHaveBeenCalledWith("Error updating User"); // Ensure the correct error message is sent
        });
    });

    describe('adminforgotpassword', () => {

        it('should return user data if user is found', async () => {
            // Arrange
            const req = {
                params: { user_email: 'test@example.com' } // Email of the user to retrieve
            };
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis()
            };

            // Mock implementations
            const user = { id: 1, email: 'test@example.com' }; // Simulated user data
            Admin_Account.adminforgotpassword.mockResolvedValue(user); // Simulate user found

            // Act
            await adminController.adminforgotpassword(req, res);

            // Assert
            expect(Admin_Account.adminforgotpassword).toHaveBeenCalledWith('test@example.com'); // Ensure the email passed is correct
            expect(res.json).toHaveBeenCalledWith(user); // Ensure the correct user data is returned
        });

        it('should return 404 if user is not found', async () => {
            // Arrange
            const req = {
                params: { user_email: 'notfound@example.com' } // Email of the user to retrieve
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            Admin_Account.adminforgotpassword.mockResolvedValue(null); // Simulate no user found

            // Act
            await adminController.adminforgotpassword(req, res);

            // Assert
            expect(Admin_Account.adminforgotpassword).toHaveBeenCalledWith('notfound@example.com'); // Ensure the email passed is correct
            expect(res.status).toHaveBeenCalledWith(404); // Ensure 404 status is set
            expect(res.send).toHaveBeenCalledWith("User not found"); // Ensure the correct error message is sent
        });

        it('should return 500 if there is an internal server error', async () => {
            // Arrange
            const req = {
                params: { user_email: 'error@example.com' } // Email of the user to retrieve
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            // Mock implementations
            Admin_Account.adminforgotpassword.mockRejectedValue(new Error("Database error")); // Simulate an error

            // Act
            await adminController.adminforgotpassword(req, res);

            // Assert
            expect(Admin_Account.adminforgotpassword).toHaveBeenCalledWith('error@example.com'); // Ensure the email passed is correct
            expect(res.status).toHaveBeenCalledWith(500); // Ensure 500 Internal Server Error status is set
            expect(res.send).toHaveBeenCalledWith("Error retrieving User"); // Ensure the correct error message is sent
        });

    });
});
