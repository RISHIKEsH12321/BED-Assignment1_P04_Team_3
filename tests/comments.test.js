const Comment = require("../models/comment");
const sql = require("mssql");

jest.mock("mssql");

describe("Comment Model", () => {
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

    describe("getAllComments", () => {
        it("should return all comments from the database", async () => {
            // Mock data to be returned by the query
            const mockResult = {
                recordset: [
                    {
                        comment_id: 1,
                        author: "John Doe",
                        date_column: new Date("2023-01-01"),
                        message: "This is a test comment message 1.",
                        post_id: 1,
                    },
                    {
                        comment_id: 2,
                        author: "Jane Smith",
                        date_column: new Date("2023-01-02"),
                        message: "This is a test comment message 2.",
                        post_id: 2,
                    },
                ],
            };

            // Mock the query method of the request object
            mockRequest.query.mockResolvedValue(mockResult);

            // Call the static method to test
            const comments = await Comment.getAllComments();

            // Assert that the returned comments match the expected structure
            expect(comments).toHaveLength(2); // Ensure two comments are returned
            expect(comments[0]).toBeInstanceOf(Comment); // Ensure each item is an instance of Comment
            expect(comments[0]).toEqual(expect.objectContaining({
                comment_id: 1,
                author: "John Doe",
                date_column: mockResult.recordset[0].date_column,
                message: "This is a test comment message 1.",
                post_id: 1,
            }));

            // Ensure the query was called with the correct SQL
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("Select * from Comments ORDER BY comment_id DESC, date_column DESC;"));
        });
    });

    describe("getCommentById", () => {
        it("should return comments by post_id", async () => {
            const postId = 1;
            const mockResult = {
                recordset: [
                    {
                        comment_id: 1,
                        author: "John Doe",
                        date_column: new Date("2023-01-01"),
                        message: "This is a test comment message 1.",
                        post_id: postId,
                    },
                    {
                        comment_id: 2,
                        author: "Jane Smith",
                        date_column: new Date("2023-01-02"),
                        message: "This is a test comment message 2.",
                        post_id: postId,
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const comments = await Comment.getCommentById(postId);

            expect(comments).toHaveLength(2); // Ensure two comments are returned
            expect(comments[0]).toBeInstanceOf(Comment);
            expect(comments[0]).toEqual(expect.objectContaining({
                comment_id: 1,
                author: "John Doe",
                date_column: mockResult.recordset[0].date_column,
                message: "This is a test comment message 1.",
                post_id: postId,
            }));

            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Comments WHERE post_id = @post_id"));
        });

        it("should return empty array when no comments found for post_id", async () => {
            const postId = 999; // Non-existent post_id
            const mockResult = { recordset: [] };

            mockRequest.query.mockResolvedValue(mockResult);

            const comments = await Comment.getCommentById(postId);

            expect(comments).toEqual([]); // Ensure empty array is returned
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Comments WHERE post_id = @post_id"));
        });
    });

    describe("createComment", () => {
        it("should create a new comment", async () => {
            const comment = "New comment";
            const postId = 1;
            const author = "John Doe";

            const mockResult = {
                rowsAffected: [1], // Simulate one row affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Comment.createComment(comment, postId, author);

            expect(result.rowsAffected[0]).toBe(1); // Ensure comment creation is successful
            expect(mockRequest.input).toHaveBeenCalledWith("message", sql.NVarChar, comment);
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.input).toHaveBeenCalledWith("author", author);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Comments"));
        });

        it("should throw an error when comment creation fails", async () => {
            const comment = "New comment";
            const postId = 1;
            const author = "John Doe";

            mockRequest.query.mockRejectedValue(new Error("Database error"));

            await expect(Comment.createComment(comment, postId, author)).rejects.toThrow("Error creating comment: Database error");

            expect(mockRequest.input).toHaveBeenCalledWith("message", sql.NVarChar, comment);
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.input).toHaveBeenCalledWith("author", author);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Comments"));
        });
    });

    describe("getCommentByCommentId", () => {
        it("should return a comment by comment_id", async () => {
            const commentId = 1;
            const mockResult = {
                recordset: [
                    {
                        comment_id: commentId,
                        author: "John Doe",
                        date_column: new Date("2023-01-01"),
                        message: "This is a test comment message 1.",
                        post_id: 1,
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const comment = await Comment.getCommentByCommentId(commentId);

            expect(comment).toBeInstanceOf(Comment);
            expect(comment).toEqual(expect.objectContaining({
                comment_id: commentId,
                author: "John Doe",
                date_column: mockResult.recordset[0].date_column,
                message: "This is a test comment message 1.",
                post_id: 1,
            }));

            expect(mockRequest.input).toHaveBeenCalledWith("comment_id", commentId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Comments WHERE comment_id = @comment_id"));
        });

        it("should return null when comment_id does not exist", async () => {
            const commentId = 999; // Non-existent comment_id
            const mockResult = { recordset: [] };

            mockRequest.query.mockResolvedValue(mockResult);

            const comment = await Comment.getCommentByCommentId(commentId);

            expect(comment).toBeNull();
            expect(mockRequest.input).toHaveBeenCalledWith("comment_id", commentId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Comments WHERE comment_id = @comment_id"));
        });
    });

    describe("deleteComment", () => {
        it("should delete a comment by comment_id", async () => {
            const commentId = 1;
            const mockResult = {
                rowsAffected: [1], // Simulate one row affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Comment.deleteComment(commentId);

            expect(result).toBe(true); // Ensure comment deletion is successful
            expect(mockRequest.input).toHaveBeenCalledWith("id", commentId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE comment_id =@id;"));
        });

        it("should return false when comment_id does not exist", async () => {
            const commentId = 999; // Non-existent comment_id
            const mockResult = {
                rowsAffected: [0], // Simulate no rows affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Comment.deleteComment(commentId);

            expect(result).toBe(false); // Ensure comment deletion fails due to non-existence
            expect(mockRequest.input).toHaveBeenCalledWith("id", commentId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE comment_id =@id;"));
        });

        it("should handle database errors during deletion", async () => {
            const commentId = 1;

            mockRequest.query.mockRejectedValue(new Error("Database error"));

            await expect(Comment.deleteComment(commentId)).rejects.toThrow("Database error");

            expect(mockRequest.input).toHaveBeenCalledWith("id", commentId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments WHERE comment_id =@id;"));
        });
    });
});
