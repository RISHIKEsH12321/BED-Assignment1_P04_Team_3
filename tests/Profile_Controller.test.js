const profileController = require("../controller/Profile_controller");
const Profile = require("../models/Profile_model");

jest.mock("../models/Profile_model");

describe("Profile Controller", () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe("getUserProfile", () => {
        it("should return user profile successfully", async () => {
            const userId = 1;
            const mockUser = {
                id: userId,
                username: "testuser",
                profile_picture_url: "mockBufferData", // Ensure this matches the mock setup
            };

            mockRequest.params = { id: userId };
            Profile.getUserProfile.mockResolvedValue(mockUser);
            Profile.bufferToBase64.mockResolvedValue("base64ImageData");

            await profileController.getUserProfile(mockRequest, mockResponse);

            expect(Profile.getUserProfile).toHaveBeenCalledWith(userId);
            expect(Profile.bufferToBase64).toHaveBeenCalledWith("mockBufferData"); // Ensure this matches the actual value
            expect(mockResponse.json).toHaveBeenCalledWith({
                id: userId,
                username: "testuser",
                profile_picture_url: "base64ImageData",
            });
        });

        it("should return 404 if user profile is not found", async () => {
            const userId = 2;

            mockRequest.params = { id: userId };
            Profile.getUserProfile.mockResolvedValue(null);

            await profileController.getUserProfile(mockRequest, mockResponse);

            expect(Profile.getUserProfile).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("User profile not found");
        });

        it("should return 500 if there is an error retrieving the user", async () => {
            const userId = 3;
            const error = new Error("Database error");

            mockRequest.params = { id: userId };
            Profile.getUserProfile.mockRejectedValue(error);

            await profileController.getUserProfile(mockRequest, mockResponse);

            expect(Profile.getUserProfile).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving User");
        });
    });

    describe("updateUserProfile", () => {
        it("should update user profile successfully", async () => {
            const userId = 1;
            const newUserData = { username: "updateduser" };
            const updatedUser = { ...newUserData, id: userId };

            mockRequest.params = { id: userId };
            mockRequest.body = newUserData;
            Profile.updateUserProfile.mockResolvedValue(updatedUser);

            await profileController.updateUserProfile(mockRequest, mockResponse);

            expect(Profile.updateUserProfile).toHaveBeenCalledWith(userId, newUserData);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should return 404 if user profile is not found for update", async () => {
            const userId = 2;
            const newUserData = { username: "updateduser" };

            mockRequest.params = { id: userId };
            mockRequest.body = newUserData;
            Profile.updateUserProfile.mockResolvedValue(null);

            await profileController.updateUserProfile(mockRequest, mockResponse);

            expect(Profile.updateUserProfile).toHaveBeenCalledWith(userId, newUserData);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("User profile not found");
        });

        it("should return 500 if there is an error updating the user", async () => {
            const userId = 3;
            const newUserData = { username: "updateduser" };
            const error = new Error("Database error");

            mockRequest.params = { id: userId };
            mockRequest.body = newUserData;
            Profile.updateUserProfile.mockRejectedValue(error);

            await profileController.updateUserProfile(mockRequest, mockResponse);

            expect(Profile.updateUserProfile).toHaveBeenCalledWith(userId, newUserData);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error updating User");
        });
    });
});