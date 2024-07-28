const Post = require("../models/forum");
const sql = require("mssql");
const dbConfig = require("../dbConfig");

jest.mock("mssql");

describe("forum Model", () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        mockRequest = {
            input: jest.fn(),
            query: jest.fn()
        };

        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection);
        sql.Request.mockImplementation(() => mockRequest);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getPostbyHeader", () => {
        it("should return posts with matching header", async () => {
            const mockResult = {
                recordset: [
                    {
                        post_id: 1,
                        date_column: new Date(),
                        header: "Test Post",
                        message: "This is a test post.",
                        author: "Test Author",
                    },
                    {
                        post_id: 2,
                        date_column: new Date(),
                        header: "Test Post 2",
                        message: "Another test post.",
                        author: "Another Author",
                    },
                ],
            };

            const mockHeader = "Test";

            mockRequest.query.mockResolvedValue(mockResult);

            const posts = await Post.getPostbyHeader(mockHeader);

            const expectedPosts = mockResult.recordset.map(
                (row) => new Post(row.post_id, row.date_column, row.header, row.message, row.author)
            );

            expect(posts).toEqual(expectedPosts);
            expect(mockRequest.input).toHaveBeenCalledWith("header", `${mockHeader}%`);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE header LIKE @header"));
        });

        it("should return an empty array when no posts match the header", async () => {
            const mockResult = {
                recordset: [],
            };

            const mockHeader = "Nonexistent";

            mockRequest.query.mockResolvedValue(mockResult);

            const posts = await Post.getPostbyHeader(mockHeader);

            expect(posts).toEqual([]);
            expect(mockRequest.input).toHaveBeenCalledWith("header", `${mockHeader}%`);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE header LIKE @header"));
        });
    });

    describe("getPostById", () => {
        it("should return a post when given a valid post_id", async () => {
            const postId = 1;

            const mockResult = {
                recordset: [
                    {
                        post_id: postId,
                        date_column: new Date(),
                        header: "Test Post",
                        message: "This is a test post.",
                        author: "Test Author",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const post = await Post.getPostById(postId);

            const expectedPost = new Post(
                mockResult.recordset[0].post_id,
                mockResult.recordset[0].date_column,
                mockResult.recordset[0].header,
                mockResult.recordset[0].message,
                mockResult.recordset[0].author
            );

            expect(post).toEqual(expectedPost);
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE post_id = @post_id"));
        });

        it("should return null when no post matches the post_id", async () => {
            const postId = 999; // Assuming post with this ID doesn't exist

            const mockResult = {
                recordset: [],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const post = await Post.getPostById(postId);

            expect(post).toBeNull();
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM Posts WHERE post_id = @post_id"));
        });
    });

    describe("getAllPosts", () => {
        it("should return all posts from the database", async () => {
            const mockResult = {
                recordset: [
                    {
                        post_id: 1,
                        date_column: new Date(),
                        header: "Test Post 1",
                        message: "This is test post 1.",
                        author: "Author 1",
                    },
                    {
                        post_id: 2,
                        date_column: new Date(),
                        header: "Test Post 2",
                        message: "This is test post 2.",
                        author: "Author 2",
                    },
                ],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const posts = await Post.getAllPosts();

            const expectedPosts = mockResult.recordset.map(
                (row) => new Post(row.post_id, row.date_column, row.header, row.message, row.author)
            );

            expect(posts).toEqual(expectedPosts);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("Select * from Posts ORDER BY post_id DESC, date_column DESC;"));
        });

        it("should return an empty array when no posts are found", async () => {
            const mockResult = {
                recordset: [],
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const posts = await Post.getAllPosts();

            expect(posts).toEqual([]);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("Select * from Posts ORDER BY post_id DESC, date_column DESC;"));
        });
    });

    describe("createPost", () => {
        it("should create a new post successfully", async () => {
            const header = "New Post";
            const message = "This is a new post.";
            const author = "New Author";

            const mockResult = {};

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Post.createPost(header, message, author);
            console.log("Result from createPost:", result);

            expect(result).toEqual(mockResult);
            expect(mockRequest.input).toHaveBeenCalledWith("header", sql.NVarChar, header);
            expect(mockRequest.input).toHaveBeenCalledWith("message", sql.NVarChar, message);
            expect(mockRequest.input).toHaveBeenCalledWith("author", author);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Posts"));
        });

        it("should handle errors during post creation", async () => {
            const header = "New Post";
            const message = "This is a new post.";
            const author = "New Author";

            const errorMessage = "Database error";

            mockRequest.query.mockRejectedValue(new Error(errorMessage));

            await expect(Post.createPost(header, message, author)).rejects.toThrow(errorMessage);

            expect(mockRequest.input).toHaveBeenCalledWith("header", sql.NVarChar, header);
            expect(mockRequest.input).toHaveBeenCalledWith("message", sql.NVarChar, message);
            expect(mockRequest.input).toHaveBeenCalledWith("author", author);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO Posts"));
        });
    });

    describe("updatePost", () => {
        it("should update a post successfully", async () => {
            const postId = 1;
            const header = "Updated Post Header";
            const message = "Updated post message.";

            const mockResult = {
                recordset: [
                    {
                    post_id: postId,
                    date_column: new Date(),
                    header: header,
                    message: message,
                    author: "Test Author",
                    },
                 ],
                };

            mockRequest.query.mockResolvedValue(mockResult);

            const updatedPost = await Post.updatePost(postId, header, message);

            expect(updatedPost).toBeDefined(); // Assuming it returns the updated post
            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.input).toHaveBeenCalledWith("header", header);
            expect(mockRequest.input).toHaveBeenCalledWith("message", message);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Posts SET"));
        });

        it("should handle errors during post update", async () => {
            const postId = 1;
            const header = "Updated Post Header";
            const message = "Updated post message.";

            const errorMessage = "Database error";

            mockRequest.query.mockRejectedValue(new Error(errorMessage));

            await expect(Post.updatePost(postId, header, message)).rejects.toThrow(errorMessage);

            expect(mockRequest.input).toHaveBeenCalledWith("post_id", postId);
            expect(mockRequest.input).toHaveBeenCalledWith("header", header);
            expect(mockRequest.input).toHaveBeenCalledWith("message", message);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE Posts SET"));
        });
    });

    describe("deletePost", () => {
        it("should delete a post successfully", async () => {
            const postId = 1;

            const mockResult = {
                rowsAffected: [1], // Assuming one row was affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Post.deletePost(postId);

            expect(result).toBe(true); // Assuming it returns true on success
            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts"));
        });

        it("should return false when no post is deleted", async () => {
            const postId = 999; // Assuming post with this ID doesn't exist

            const mockResult = {
                rowsAffected: [0], // Assuming no rows were affected
            };

            mockRequest.query.mockResolvedValue(mockResult);

            const result = await Post.deletePost(postId);

            expect(result).toBe(false);
            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts"));
        });

        it("should handle errors during post deletion", async () => {
            const postId = 1;

            const errorMessage = "Database error";

            mockRequest.query.mockRejectedValue(new Error(errorMessage));

            await expect(Post.deletePost(postId)).rejects.toThrow(errorMessage);

            expect(mockRequest.input).toHaveBeenCalledWith("id", postId);
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Comments"));
            expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM Posts"));
        });
    });
});
