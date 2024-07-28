const forumController = require("../controller/forumController");
const Post = require("../models/forum");

jest.mock("../models/forum");

describe("Forum Controller", () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            redirect: jest.fn().mockReturnThis(),
        };
    });

    describe("getPostbyHeader", () => {
        it("should return a post successfully", async () => {
            const header = "Test Post";
            const mockPost = {
                header: header,
                message: "This is a test message",
                author: "Test Author",
            };

            mockRequest.params = { header: header };
            Post.getPostbyHeader.mockResolvedValue(mockPost);

            await forumController.getPostbyHeader(mockRequest, mockResponse);

            expect(Post.getPostbyHeader).toHaveBeenCalledWith(header);
            expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
        });

        it("should return 404 if post is not found", async () => {
            const header = "Nonexistent Post";

            mockRequest.params = { header: header };
            Post.getPostbyHeader.mockResolvedValue(null);

            await forumController.getPostbyHeader(mockRequest, mockResponse);

            expect(Post.getPostbyHeader).toHaveBeenCalledWith(header);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("post not found");
        });

        it("should return 500 if there is an error retrieving the post", async () => {
            const header = "Error Post";
            const error = new Error("Database error");

            mockRequest.params = { header: header };
            Post.getPostbyHeader.mockRejectedValue(error);

            await forumController.getPostbyHeader(mockRequest, mockResponse);

            expect(Post.getPostbyHeader).toHaveBeenCalledWith(header);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving post");
        });
    });

    describe("getAllPosts", () => {
        it("should return all posts successfully", async () => {
            const mockPosts = [
                { header: "Post 1", message: "Message 1", author: "Author 1" },
                { header: "Post 2", message: "Message 2", author: "Author 2" },
            ];

            Post.getAllPosts.mockResolvedValue(mockPosts);

            await forumController.getAllPosts(mockRequest, mockResponse);

            expect(Post.getAllPosts).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
        });

        it("should return 500 if there is an error retrieving posts", async () => {
            const error = new Error("Database error");

            Post.getAllPosts.mockRejectedValue(error);

            await forumController.getAllPosts(mockRequest, mockResponse);

            expect(Post.getAllPosts).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving posts");
        });
    });

    describe("createPost", () => {
        it("should create a new post successfully", async () => {
            const newPost = {
                header: "New Post",
                message: "New message",
                author: "New Author",
            };

            mockRequest.body = newPost;
            Post.createPost.mockResolvedValue(newPost);

            await forumController.createPost(mockRequest, mockResponse);

            expect(Post.createPost).toHaveBeenCalledWith(newPost.header, newPost.message, newPost.author);
            expect(mockResponse.redirect).toHaveBeenCalledWith('/forum');
        });

        it("should return 500 if there is an error creating the post", async () => {
            const newPost = {
                header: "New Post",
                message: "New message",
                author: "New Author",
            };
            const error = new Error("Database error");

            mockRequest.body = newPost;
            Post.createPost.mockRejectedValue(error);

            await forumController.createPost(mockRequest, mockResponse);

            expect(Post.createPost).toHaveBeenCalledWith(newPost.header, newPost.message, newPost.author);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error submitting post");
        });
    });

    describe("getPostById", () => {
        it("should return a post by ID successfully", async () => {
            const postId = 1;
            const mockPost = {
                id: postId,
                header: "Post by ID",
                message: "Message by ID",
                author: "Author by ID",
            };

            mockRequest.params = { post_id: postId };
            Post.getPostById.mockResolvedValue(mockPost);

            await forumController.getPostById(mockRequest, mockResponse);

            expect(Post.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
        });

        it("should return 404 if post is not found by ID", async () => {
            const postId = 2;

            mockRequest.params = { post_id: postId };
            Post.getPostById.mockResolvedValue(null);

            await forumController.getPostById(mockRequest, mockResponse);

            expect(Post.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Post not found");
        });

        it("should return 500 if there is an error retrieving the post by ID", async () => {
            const postId = 3;
            const error = new Error("Database error");

            mockRequest.params = { post_id: postId };
            Post.getPostById.mockRejectedValue(error);

            await forumController.getPostById(mockRequest, mockResponse);

            expect(Post.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving post");
        });
    });

    describe("updatePost", () => {
        it("should update a post successfully", async () => {
            const postId = 1;
            const updatedPost = {
                id: postId,
                header: "Updated Post",
                message: "Updated message",
            };

            mockRequest.params = { post_id: postId };
            mockRequest.body = updatedPost;
            Post.updatePost.mockResolvedValue(updatedPost);

            await forumController.updatePost(mockRequest, mockResponse);

            expect(Post.updatePost).toHaveBeenCalledWith(postId, updatedPost.header, updatedPost.message);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedPost);
        });

        it("should return 404 if post is not found for update", async () => {
            const postId = 2;
            const updatedPost = {
                header: "Updated Post",
                message: "Updated message",
            };

            mockRequest.params = { post_id: postId };
            mockRequest.body = updatedPost;
            Post.updatePost.mockResolvedValue(null);

            await forumController.updatePost(mockRequest, mockResponse);

            expect(Post.updatePost).toHaveBeenCalledWith(postId, updatedPost.header, updatedPost.message);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Post not found");
        });

        it("should return 500 if there is an error updating the post", async () => {
            const postId = 3;
            const updatedPost = {
                header: "Updated Post",
                message: "Updated message",
            };
            const error = new Error("Database error");

            mockRequest.params = { post_id: postId };
            mockRequest.body = updatedPost;
            Post.updatePost.mockRejectedValue(error);

            await forumController.updatePost(mockRequest, mockResponse);

            expect(Post.updatePost).toHaveBeenCalledWith(postId, updatedPost.header, updatedPost.message);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error updating post");
        });
    });

    describe("deletePost", () => {
        it("should delete a post successfully", async () => {
            const postId = 1;

            mockRequest.params = { post_id: postId };
            Post.deletePost.mockResolvedValue(true);

            await forumController.deletePost(mockRequest, mockResponse);

            expect(Post.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it("should return 404 if post is not found for deletion", async () => {
            const postId = 2;

            mockRequest.params = { post_id: postId };
            Post.deletePost.mockResolvedValue(false);

            await forumController.deletePost(mockRequest, mockResponse);

            expect(Post.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Post not found");
        });

        it("should return 500 if there is an error deleting the post", async () => {
            const postId = 3;
            const error = new Error("Database error");

            mockRequest.params = { post_id: postId };
            Post.deletePost.mockRejectedValue(error);

            await forumController.deletePost(mockRequest, mockResponse);

            expect(Post.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error deleting post");
        });
    });
});
