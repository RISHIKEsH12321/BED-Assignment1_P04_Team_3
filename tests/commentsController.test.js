const Comment = require("../models/comment");
const commentController = require("../controller/commentsController");

jest.mock("../models/comment");

describe("Comment Controller", () => {
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

    describe("getAllComments", () => {
        it("should return all comments successfully", async () => {
            const mockComments = [
                { comment_id: 1, author: "User1", message: "Message 1" },
                { comment_id: 2, author: "User2", message: "Message 2" },
            ];

            Comment.getAllComments.mockResolvedValue(mockComments);

            await commentController.getAllComments(mockRequest, mockResponse);

            expect(Comment.getAllComments).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockComments);
        });

        it("should return 500 if there is an error retrieving comments", async () => {
            const error = new Error("Database error");

            Comment.getAllComments.mockRejectedValue(error);

            await commentController.getAllComments(mockRequest, mockResponse);

            expect(Comment.getAllComments).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving comments");
        });
    });

    describe("getCommentById", () => {
        it("should return a comment by id successfully", async () => {
            const commentId = 1;
            const mockComment = { comment_id: commentId, author: "User1", message: "Test comment" };

            Comment.getCommentById.mockResolvedValue(mockComment);
            mockRequest.params = { postId: commentId };

            await commentController.getCommentById(mockRequest, mockResponse);

            expect(Comment.getCommentById).toHaveBeenCalledWith(commentId);
            expect(mockResponse.json).toHaveBeenCalledWith(mockComment);
        });

        it("should return 404 if comment is not found", async () => {
            const commentId = 999;

            Comment.getCommentById.mockResolvedValue(null);
            mockRequest.params = { postId: commentId };

            await commentController.getCommentById(mockRequest, mockResponse);

            expect(Comment.getCommentById).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Comment not found");
        });

        it("should return 500 if there is an error retrieving the comment", async () => {
            const commentId = 888;
            const error = new Error("Database error");

            Comment.getCommentById.mockRejectedValue(error);
            mockRequest.params = { postId: commentId };

            await commentController.getCommentById(mockRequest, mockResponse);

            expect(Comment.getCommentById).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving comments");
        });
    });

    describe("createComment", () => {
        it("should create a new comment successfully", async () => {
            const newComment = {
                comment: "New comment",
                post_id: 1,
                author: "User1",
            };

            const mockResult = { /* Mock the expected result here */ };
            Comment.createComment.mockResolvedValue(mockResult);
            mockRequest.body = newComment;

            await commentController.createComment(mockRequest, mockResponse);

            expect(Comment.createComment).toHaveBeenCalledWith(newComment.comment, newComment.post_id, newComment.author);
            expect(mockResponse.redirect).toHaveBeenCalledWith('/forum');
            // Add more expectations as needed based on your implementation
        });

        it("should handle error when creating comment fails", async () => {
            const newComment = {
                comment: "New comment",
                post_id: 1,
                author: "User1",
            };

            const error = new Error("Database error");
            Comment.createComment.mockRejectedValue(error);
            mockRequest.body = newComment;

            await commentController.createComment(mockRequest, mockResponse);

            expect(Comment.createComment).toHaveBeenCalledWith(newComment.comment, newComment.post_id, newComment.author);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error submitting comment");
        });
    });

    describe("getCommentByCommentId", () => {
        it("should return a comment by comment_id successfully", async () => {
            const commentId = 1;
            const mockComment = { comment_id: commentId, author: "User1", message: "Test comment" };

            Comment.getCommentByCommentId.mockResolvedValue(mockComment);
            mockRequest.params = { comment_id: commentId };

            await commentController.getCommentByCommentId(mockRequest, mockResponse);

            expect(Comment.getCommentByCommentId).toHaveBeenCalledWith(commentId);
            expect(mockResponse.json).toHaveBeenCalledWith(mockComment);
        });

        it("should return 404 if comment by comment_id is not found", async () => {
            const commentId = 999;

            Comment.getCommentByCommentId.mockResolvedValue(null);
            mockRequest.params = { comment_id: commentId };

            await commentController.getCommentByCommentId(mockRequest, mockResponse);

            expect(Comment.getCommentByCommentId).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Comment not found");
        });

        it("should return 500 if there is an error retrieving the comment by comment_id", async () => {
            const commentId = 888;
            const error = new Error("Database error");

            Comment.getCommentByCommentId.mockRejectedValue(error);
            mockRequest.params = { comment_id: commentId };

            await commentController.getCommentByCommentId(mockRequest, mockResponse);

            expect(Comment.getCommentByCommentId).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error retrieving comment");
        });
    });

    describe("deleteComment", () => {
        it("should delete a comment successfully", async () => {
            const commentId = 1;

            Comment.deleteComment.mockResolvedValue(true);
            mockRequest.params = { comment_id: commentId };

            await commentController.deleteComment(mockRequest, mockResponse);

            expect(Comment.deleteComment).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalledWith();
        });

        it("should return 404 if comment to delete is not found", async () => {
            const commentId = 999;

            Comment.deleteComment.mockResolvedValue(false);
            mockRequest.params = { comment_id: commentId };

            await commentController.deleteComment(mockRequest, mockResponse);

            expect(Comment.deleteComment).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Comment not found");
        });

        it("should return 500 if there is an error deleting the comment", async () => {
            const commentId = 888;
            const error = new Error("Database error");

            Comment.deleteComment.mockRejectedValue(error);
            mockRequest.params = { comment_id: commentId };

            await commentController.deleteComment(mockRequest, mockResponse);

            expect(Comment.deleteComment).toHaveBeenCalledWith(commentId);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Error deleting comment");
        });
    });
});
