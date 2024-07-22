const Admin_Forum = require("../models/admin_Forum");
const sql = require("mssql");

jest.mock("mssql");

describe("Admin_Forum Model", () => {
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

    describe("getAllPosts", () => {
        it("should return all posts from the database", async () => {
            // Mock data to be returned by the query
            const mockResult = {
                recordset: [
                    {
                        post_id: 1,
                        date_column: new Date("2023-01-01"),
                        header: "Test Post 1",
                        message: "This is a test post message 1.",
                        author: "John Doe",
                    },
                    {
                        post_id: 2,
                        date_column: new Date("2023-01-02"),
                        header: "Test Post 2",
                        message: "This is a test post message 2.",
                        author: "Jane Smith",
                    },
                ],
            };

            // Mock the query method of the request object
            mockRequest.query.mockResolvedValue(mockResult);

            // Call the static method to test
            const posts = await Admin_Forum.getAllPosts();

            // Assert that the returned posts match the expected structure
            expect(posts).toHaveLength(2); // Ensure two posts are returned
            expect(posts[0]).toBeInstanceOf(Admin_Forum); // Ensure each item is an instance of Admin_Forum
            expect(posts[0]).toEqual(expect.objectContaining({
                post_id: 1,
                date_column: mockResult.recordset[0].date_column,
                header: "Test Post 1",
                message: "This is a test post message 1.",
                author: "John Doe",
            }));

            // Ensure the query was called with the correct SQL
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts"));
        });
    });

    describe("getPostById", () => {
        it("should return a post by post_id", async () => {
            const postId = 1;
            const mockResult = {
                recordset: [
                    {
                        post_id: postId,
                        date_column: new Date("2023-01-01"),
                        header: "Test Post 1",
                        message: "This is a test post message 1.",
                        author: "John Doe",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const post = await Admin_Forum.getPostById(postId);

            expect(post).toBeInstanceOf(Admin_Forum);
            expect(post).toEqual(expect.objectContaining({
                post_id: postId,
                date_column: mockResult.recordset[0].date_column,
                header: "Test Post 1",
                message: "This is a test post message 1.",
                author: "John Doe",
            }));

            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE post_id = @post_id"));
        });

        it("should return null when post_id does not exist", async () => {
            const postId = 999; // Non-existent post_id
            const mockResult = { recordset: [] };

            mockRequest.query.mockResolvedValue(mockResult);

            const post = await Admin_Forum.getPostById(postId);

            expect(post).toBeNull();
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE post_id = @post_id"));
        });
    });

    describe("deletePost", () => {
        it("should delete a post by post_id", async () => {
            const postId = 1;
            const mockResult = {
                rowsAffected: [1], // Simulate one row affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Admin_Forum.deletePost(postId);

            expect(result).toBe(true); // Ensure post deletion is successful
            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE post_id =@id"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts WHERE post_id = @id"));
        });

        it("should return false when post_id does not exist", async () => {
            const postId = 999; // Non-existent post_id
            const mockResult = {
                rowsAffected: [0], // Simulate no rows affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Admin_Forum.deletePost(postId);

            expect(result).toBe(false); // Ensure post deletion fails due to non-existence
            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE post_id =@id"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts WHERE post_id = @id"));
        });

        it("should handle database errors during deletion", async () => {
            const postId = 1;

            mockRequest.query.mockRejectedValue(new Error("Database error"));

            await expect(Admin_Forum.deletePost(postId)).rejects.toThrow("Database error");

            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE post_id =@id"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts WHERE post_id = @id"));
        });
    });
});
