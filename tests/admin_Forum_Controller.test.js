const Admin_Forum = require("../models/admin_Forum");
const adminForumController = require("../controller/admin_Forum_Controller");

jest.mock("../models/admin_Forum");

describe("Admin Forum Controller", () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe("getAllPosts", () => {
        it("should return all posts successfully", async () => {
            const mockPosts = [
                { id: 1, title: "Post 1", content: "Content 1" },
                { id: 2, title: "Post 2", content: "Content 2" },
            ];

            Admin_Forum.getAllPosts.mockResolvedValue(mockPosts);

            await adminForumController.getAllPosts(mockRequest, mockResponse);

            expect(Admin_Forum.getAllPosts).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockPosts);
        });

        it("should return 500 if there is an error retrieving posts", async () => {
            const error = new Error("Database error");

            Admin_Forum.getAllPosts.mockRejectedValue(error);

            await adminForumController.getAllPosts(mockRequest, mockResponse);

            expect(Admin_Forum.getAllPosts).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving posts");
        });
    });

    describe("getPostById", () => {
        it("should return a post by id successfully", async () => {
            const postId = 1;
            const mockPost = { id: postId, title: "Test Post", content: "Test Content" };

            Admin_Forum.getPostById.mockResolvedValue(mockPost);
            mockRequest.params = { post_id: postId };

            await adminForumController.getPostById(mockRequest, mockResponse);

            expect(Admin_Forum.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.json).toHaveBeenCalledWith(mockPost);
        });

        it("should return 404 if post is not found", async () => {
            const postId = 999;

            Admin_Forum.getPostById.mockResolvedValue(null);
            mockRequest.params = { post_id: postId };

            await adminForumController.getPostById(mockRequest, mockResponse);

            expect(Admin_Forum.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Post not found");
        });

        it("should return 500 if there is an error retrieving the post", async () => {
            const postId = 888;
            const error = new Error("Database error");

            Admin_Forum.getPostById.mockRejectedValue(error);
            mockRequest.params = { post_id: postId };

            await adminForumController.getPostById(mockRequest, mockResponse);

            expect(Admin_Forum.getPostById).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving post");
        });
    });

    describe("deletePost", () => {
        it("should delete a post successfully", async () => {
            const postId = 1;

            Admin_Forum.deletePost.mockResolvedValue(true);
            mockRequest.params = { post_id: postId };

            await adminForumController.deletePost(mockRequest, mockResponse);

            expect(Admin_Forum.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalledWith();
        });

        it("should return 404 if post to delete is not found", async () => {
            const postId = 999;

            Admin_Forum.deletePost.mockResolvedValue(false);
            mockRequest.params = { post_id: postId };

            await adminForumController.deletePost(mockRequest, mockResponse);

            expect(Admin_Forum.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Post not found");
        });

        it("should return 500 if there is an error deleting the post", async () => {
            const postId = 888;
            const error = new Error("Database error");

            Admin_Forum.deletePost.mockRejectedValue(error);
            mockRequest.params = { post_id: postId };

            await adminForumController.deletePost(mockRequest, mockResponse);

            expect(Admin_Forum.deletePost).toHaveBeenCalledWith(postId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error deleting post");
        });
    });
});
