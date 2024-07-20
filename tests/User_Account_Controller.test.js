const userController = require("../controller/User_Account_Controller");
const User_Account = require("../models/User_Account");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../models/User_Account");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("userlogin", () => {
        it("should return a token and user_id for valid login", async () => {
            const req = {
                body: {
                    username: "testuser",
                    user_password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockUser = {
                user_id: 1,
                username: "testuser",
                user_password: await bcryptjs.hash("password123", 10)
            };

            User_Account.userlogin.mockResolvedValue(mockUser);
            bcryptjs.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("fake-jwt-token");

            await userController.userlogin(req, res);

            expect(User_Account.userlogin).toHaveBeenCalledWith("testuser");
            expect(bcryptjs.compare).toHaveBeenCalledWith("password123", mockUser.user_password);
            expect(jwt.sign).toHaveBeenCalledWith({ user_id: mockUser.user_id, username: mockUser.username }, process.env.JWT_SECERT, { expiresIn: "3600s" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successful",
                token: "fake-jwt-token",
                user_id: mockUser.user_id
            });
        });

        it("should return 401 for invalid login", async () => {
            const req = {
                body: {
                    username: "testuser",
                    user_password: "wrongpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockUser = {
                user_id: 1,
                username: "testuser",
                user_password: await bcryptjs.hash("password123", 10)
            };

            User_Account.userlogin.mockResolvedValue(mockUser);
            bcryptjs.compare.mockResolvedValue(false);

            await userController.userlogin(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid username or password" });
        });

        it("should return 500 for internal server error", async () => {
            const req = {
                body: {
                    username: "testuser",
                    user_password: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            User_Account.userlogin.mockRejectedValue(new Error("Internal server error"));

            await userController.userlogin(req, res);

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
                json: jest.fn(),
                send: jest.fn()
            };

            const mockUser = {
                user_id: 1,
                username: "testuser",
                user_email: "testuser@example.com"
            };

            User_Account.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(req, res);

            expect(User_Account.getUserById).toHaveBeenCalledWith(1);
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

            User_Account.getUserById.mockResolvedValue(null);

            await userController.getUserById(req, res);

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

            User_Account.getUserById.mockRejectedValue(new Error("Internal server error"));

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error retrieving User");
        });

        it("should return 500 for database connectivity issues", async () => {
            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
        
            User_Account.getUserById.mockRejectedValue(new Error("Database connection failed"));
        
            await userController.getUserById(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Database connection failed");
        });
    });

    describe("createAccount", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it("should create a new account and return 201 status", async () => {
            const req = {
                body: {
                    username: "newuser",
                    user_email: "newuser@example.com",
                    user_phonenumber: "1234567890",
                    user_password: "password123",
                    user_role: "user"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const hashedPassword = await bcryptjs.hash("password123", 10);
            const newAccount = {
                user_id: 1,
                username: "newuser",
                user_email: "newuser@example.com",
                user_phonenumber: "1234567890",
                user_password: hashedPassword,
                user_role: "user"
            };
    
            bcryptjs.hash.mockResolvedValue(hashedPassword);
            User_Account.createAccount.mockResolvedValue(newAccount);
    
            await userController.createAccount(req, res);
    
            expect(bcryptjs.hash).toHaveBeenCalledWith("password123", expect.any(Number));
            expect(User_Account.createAccount).toHaveBeenCalledWith(expect.objectContaining({
                username: "newuser",
                user_email: "newuser@example.com",
                user_phonenumber: "1234567890",
                user_password: hashedPassword,
                user_role: "user"
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newAccount);
        });
    
        it("should return 400 if required fields are missing", async () => {
            const req = {
                body: {
                    username: "newuser"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            await userController.createAccount(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
        });
    
        it("should return 500 for internal server error", async () => {
            const req = {
                body: {
                    username: "newuser",
                    user_email: "newuser@example.com",
                    user_phonenumber: "1234567890",
                    user_password: "password123",
                    user_role: "user"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
        
            // Define the error simulation only for this call
            bcryptjs.hash.mockImplementationOnce(() => Promise.reject(new Error("Hashing error")));
        
            await userController.createAccount(req, res);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error creating User");
        });
    });
    
    describe("updateUser", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it("should update user details and return updated user", async () => {
            const req = {
                params: {
                    id: "1"
                },
                body: {
                    username: "updateduser",
                    user_email: "updateduser@example.com",
                    user_phonenumber: "098765431",
                    user_password: "newpassword123",
                    user_role: "user"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const salt = "salt";
            const hashedPassword = await bcryptjs.hash("newpassword123", salt);
    
            // Ensure mocks are only set up for this test
            bcryptjs.genSalt.mockResolvedValue(salt);
            bcryptjs.hash.mockResolvedValue(hashedPassword);
    
            const updatedUser = {
                user_id: 1,
                username: "updateduser",
                user_email: "updateduser@example.com",
                user_phonenumber: "098765431",
                user_password: hashedPassword,
                user_role: "user"
            };
    
            User_Account.updateUser.mockResolvedValue(updatedUser);
    
            await userController.updateUser(req, res);
    
            expect(bcryptjs.hash).toHaveBeenCalledWith("newpassword123", salt);
            expect(User_Account.updateUser).toHaveBeenCalledWith(1, {
                username: "updateduser",
                user_email: "updateduser@example.com",
                user_phonenumber: "098765431",
                user_password: hashedPassword,
                user_role: "user"
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });
    
        it("should handle hashing errors", async () => {
            const req = {
                params: {
                    id: "1"
                },
                body: {
                    username: "updateduser",
                    user_email: "updateduser@example.com",
                    user_phonenumber: "098765431",
                    user_password: "newpassword123",
                    user_role: "user"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            bcryptjs.genSalt.mockResolvedValue("salt");
            // bcryptjs.hash.mockRejectedValue(new Error("Hashing error"));
            bcryptjs.hash.mockImplementationOnce(() => Promise.reject(new Error("Hashing error")));
    
            await userController.updateUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error updating User");
        });
    
        it("should return 404 if user not found", async () => {
            const req = {
                params: {
                    id: "1"
                },
                body: {
                    username: "updateduser"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            User_Account.updateUser.mockResolvedValue(null);
    
            await userController.updateUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("User not found");
        });
    
        it("should return 500 for internal server error", async () => {
            const req = {
                params: {
                    id: "1"
                },
                body: {
                    username: "updateduser",
                    user_password: "newpassword123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            User_Account.updateUser.mockRejectedValue(new Error("Update error"));
    
            await userController.updateUser(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error updating User");
        });
    });

    describe("deleteUser", () => {
        it("should delete a user and return 204 status for successful deletion", async () => {
            const req = {
                params: {
                    id: "1"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            User_Account.deleteUser.mockResolvedValue(true); // Mock successful deletion

            await userController.deleteUser(req, res);

            expect(User_Account.deleteUser).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
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

            User_Account.deleteUser.mockResolvedValue(false); // Mock user not found

            await userController.deleteUser(req, res);

            expect(User_Account.deleteUser).toHaveBeenCalledWith(1);
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

            User_Account.deleteUser.mockRejectedValue(new Error("Database error")); // Mock error

            await userController.deleteUser(req, res);

            expect(User_Account.deleteUser).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error deleting User");
        });
    });

    describe("userforgotpassword", () => {
        it("should return user details for a valid email", async () => {
            const req = {
                params: {
                    user_email: "testuser@example.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const mockUser = {
                user_id: 1,
                username: "testuser",
                user_email: "testuser@example.com"
            };
    
            User_Account.userforgotpassword.mockResolvedValue(mockUser);
    
            await userController.userforgotpassword(req, res);
    
            expect(User_Account.userforgotpassword).toHaveBeenCalledWith("testuser@example.com");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
    
        it("should return 404 if user not found", async () => {
            const req = {
                params: {
                    user_email: "nonexistentuser@example.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            User_Account.userforgotpassword.mockResolvedValue(null);
    
            await userController.userforgotpassword(req, res);
    
            expect(User_Account.userforgotpassword).toHaveBeenCalledWith("nonexistentuser@example.com");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith("User not found");
        });
    
        it("should return 500 for internal server error", async () => {
            const req = {
                params: {
                    user_email: "testuser@example.com"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };
    
            User_Account.userforgotpassword.mockRejectedValue(new Error("Internal server error"));
    
            await userController.userforgotpassword(req, res);
    
            expect(User_Account.userforgotpassword).toHaveBeenCalledWith("testuser@example.com");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith("Error retrieving User");
        });
    });

    describe("checkPassword", () => {
        it("should return 200 for correct password", async () => {
            const req = {
                body: {
                    user_id: 1,
                    currentPassword: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const mockUser = {
                user_id: 1,
                user_password: await bcryptjs.hash("password123", 10)
            };
    
            User_Account.getUserById.mockResolvedValue(mockUser);
            bcryptjs.compare.mockResolvedValue(true);
    
            await userController.checkPassword(req, res);
    
            expect(User_Account.getUserById).toHaveBeenCalledWith(1);
            expect(bcryptjs.compare).toHaveBeenCalledWith("password123", mockUser.user_password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Password is correct" });
        });
    
        it("should return 401 for incorrect password", async () => {
            const req = {
                body: {
                    user_id: 1,
                    currentPassword: "wrongpassword"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            const mockUser = {
                user_id: 1,
                user_password: await bcryptjs.hash("password123", 10)
            };
    
            User_Account.getUserById.mockResolvedValue(mockUser);
            bcryptjs.compare.mockResolvedValue(false);
    
            await userController.checkPassword(req, res);
    
            expect(User_Account.getUserById).toHaveBeenCalledWith(1);
            expect(bcryptjs.compare).toHaveBeenCalledWith("wrongpassword", mockUser.user_password);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid password" });
        });
    
        it("should return 404 if user not found", async () => {
            const req = {
                body: {
                    user_id: 1,
                    currentPassword: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            User_Account.getUserById.mockResolvedValue(null);
    
            await userController.checkPassword(req, res);
    
            expect(User_Account.getUserById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    
        it("should return 500 for internal server error", async () => {
            const req = {
                body: {
                    user_id: 1,
                    currentPassword: "password123"
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
    
            User_Account.getUserById.mockRejectedValue(new Error("Database error"));
    
            await userController.checkPassword(req, res);
    
            expect(User_Account.getUserById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });
});