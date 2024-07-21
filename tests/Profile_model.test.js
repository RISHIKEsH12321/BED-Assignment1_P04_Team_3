const Profile = require("../models/Profile_model")
const sql = require("mssql");

jest.mock("mssql");

describe("Profile Model", () => {
    let mockRequest, mockConnection;

    beforeEach(() => {
        mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn()
        };
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getUserProfile", () => {
        it("should return a user profile if found", async () => {
            const userId = 1;
            const mockProfileData = {
                profile_id: 1,
                user_id: userId,
                about_me: "About me",
                country: "Country",
                position: "Position",
                security_code: "1234",
                profile_picture_url: "mockBufferData"
            };

            mockRequest.query.mockResolvedValue({ recordset: [mockProfileData] });

            const profile = await Profile.getUserProfile(userId);

            expect(sql.connect).toHaveBeenCalledWith(require("../dbConfig"));
            expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
            expect(mockRequest.query).toHaveBeenCalledWith("SELECT * FROM Profile WHERE user_id = @user_id");
            expect(profile).toEqual(new Profile(
                mockProfileData.profile_id,
                mockProfileData.user_id,
                mockProfileData.about_me,
                mockProfileData.country,
                mockProfileData.position,
                mockProfileData.security_code,
                mockProfileData.profile_picture_url
            ));
        });

        it("should return null if no user profile is found", async () => {
            const userId = 2;
            mockRequest.query.mockResolvedValue({ recordset: [] });

            const profile = await Profile.getUserProfile(userId);

            expect(profile).toBeNull();
        });
    });

    describe("updateUserProfile", () => {
        it("should update user profile and return the updated profile", async () => {
            const userId = 1;
            const newProfileData = {
                about_me: "Updated about me",
                country: "Updated country",
                position: "Updated position",
                security_code: "5678",
                profile_picture_base64: "data:image/jpeg;base64,updatedBase64Data"
            };
            const updatedProfile = {
                profile_id: 1,
                user_id: userId,
                ...newProfileData,
                profile_picture_url: Buffer.from("updatedBase64Data", 'base64')
            };

            // Mock current profile returned by getUserProfile
            jest.spyOn(Profile, 'getUserProfile').mockResolvedValue(updatedProfile);

            mockRequest.query.mockResolvedValue({});

            const result = await Profile.updateUserProfile(userId, newProfileData);

            expect(Profile.getUserProfile).toHaveBeenCalledWith(userId);
            expect(mockRequest.input).toHaveBeenCalledWith("user_id", userId);
            expect(mockRequest.input).toHaveBeenCalledWith("about_me", newProfileData.about_me);
            expect(mockRequest.input).toHaveBeenCalledWith("country", newProfileData.country);
            expect(mockRequest.input).toHaveBeenCalledWith("position", newProfileData.position);
            expect(mockRequest.input).toHaveBeenCalledWith("security_code", newProfileData.security_code);
            expect(mockRequest.input).toHaveBeenCalledWith("profile_picture_url", expect.any(Buffer));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Profile"));
            expect(result).toEqual(updatedProfile);
        });

        it("should handle cases where the current profile is not found", async () => {
            const userId = 2;
            const newProfileData = { about_me: "New about me" };

            jest.spyOn(Profile, 'getUserProfile').mockResolvedValue(null);

            await expect(Profile.updateUserProfile(userId, newProfileData))
                .rejects
                .toThrow("Profile not found");
        });
    });

    describe("bufferToBase64", () => {
        it("should convert a buffer to a base64 string", async () => {
            const buffer = Buffer.from("test data");
            const base64String = await Profile.bufferToBase64(buffer);

            expect(base64String).toBe("dGVzdCBkYXRh");
        });
    });
});