const feedbackController = require("../controller/feedbackController");
const Feedback = require("../models/feedback");

//Mock feedback model
jest.mock("../models/feedback");


// test getOngoingFeedback
describe("feedbackController.getOngoingFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should fetch all ongoing feedbacks and return a JSON response", async () => {
        const mockFeedbacks = [
            { id: 1, type: "bug", name: "jason", email: "jason@1.com", number: 3322, comment: "nothing", resolved: "N", favourite: "Y", date_created: 12/12/12},
            { id: 20, type: "account", name: "bre", email: "bre@2.com", number: 1234, comment: "good stuff", resolved: "N", favourite: "N"}
        ];

        // Mock the Feedback.getOngoingFeedback function to return mock data
        Feedback.getOngoingFeedback.mockResolvedValue(mockFeedbacks);

        const req = {};
        const res = {
            json: jest.fn(), // Mock the res.json function
        };

        await feedbackController.getOngoingFeedback(req, res);

        expect(Feedback.getOngoingFeedback).toHaveBeenCalledTimes(1); //check if getOngoingFeedback was called
        expect(res.json).toHaveBeenCalledWith(mockFeedbacks); // check the response body
    });

    it("should handle erros and return a 500 status with error message", async ()=> {
        const errorMessage = "Database error";
        Feedback.getOngoingFeedback.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.getOngoingFeedback(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving feedbacks");
    });
});


// getResolvedFeedback
describe("feedbackController.getResolvedFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should fetch all resolved feedbacks and return a JSON response", async () => {
        const mockFeedbacks = [
            { id: 1, type: "bug", name: "jason", email: "jason@1.com", number: 3322, comment: "nothing", resolved: "Y", favourite: "Y", date_created: 12/12/12},
            { id: 20, type: "account", name: "bre", email: "bre@2.com", number: 1234, comment: "good stuff", resolved: "Y", favourite: "N"}
        ];

        // Mock the Feedback.getResolvedFeedback function to return mock data
        Feedback.getResolvedFeedback.mockResolvedValue(mockFeedbacks);

        const req = {};
        const res = {
            json: jest.fn(), // Mock the res.json function
        };

        await feedbackController.getResolvedFeedback(req, res);

        expect(Feedback.getResolvedFeedback).toHaveBeenCalledTimes(1); //check if getResolvedFeedback was called
        expect(res.json).toHaveBeenCalledWith(mockFeedbacks); // check the response body
    });

    it("should handle erros and return a 500 status with error message", async ()=> {
        const errorMessage = "Database error";
        Feedback.getResolvedFeedback.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.getResolvedFeedback(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving feedbacks");
    });
});


// getFavourite
describe("feedbackController.getFavourite", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should fetch all favourited feedbacks and return a JSON response", async () => {
        const mockFeedbacks = [
            { id: 1, type: "bug", name: "jason", email: "jason@1.com", number: 3322, comment: "nothing", resolved: "Y", favourite: "Y", date_created: 12/12/12},
            { id: 20, type: "account", name: "bre", email: "bre@2.com", number: 1234, comment: "good stuff", resolved: "N", favourite: "Y"}
        ];

        Feedback.getFavourite.mockResolvedValue(mockFeedbacks);

        const req = {};
        const res = {
            json: jest.fn(), // Mock the res.json function
        };

        await feedbackController.getFavourite(req, res);

        expect(Feedback.getFavourite).toHaveBeenCalledTimes(1); 
        expect(res.json).toHaveBeenCalledWith(mockFeedbacks); // check the response body
    });

    it("should handle erros and return a 500 status with error message", async ()=> {
        const errorMessage = "Database error";
        Feedback.getFavourite.mockRejectedValue(new Error(errorMessage)); // Simulate an error

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.getFavourite(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving feedbacks");
    });
});



// Test case for updateResolve function
describe("feedbackController.updateResolve", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should update the resolve status", async () => {
        const mockFeedback = { id: 20, resolved: "N"}
        const updatedFeedback = { id: 20, resolved: "Y"}

        // Mock the Feedback.updateResolve function
        Feedback.updateResolve.mockResolvedValue(updatedFeedback);

        const req = {
            params: { id: mockFeedback.id },
            body: { resolve: "Y" }
        };

        const res = {
            json: jest.fn(), // Mock the res.json function
        };

        await feedbackController.updateResolve(req, res);

        expect(Feedback.updateResolve).toHaveBeenCalledWith(mockFeedback.id, { resolve: "Y" }); // Check if updateResolve was called with correct parameters
        expect(res.json).toHaveBeenCalledWith(updatedFeedback); // Check the response body
    });
});


// Test case for getFeedbackById function
describe("feedbackController.getFeedbackById", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should fetch feedback by ID and return a JSON response", async () => {
        const feedbackId = 1;
        const mockFeedback = { id: feedbackId, type: "bug", name: "jason", email: "jason@1.com", number: 3322, comment: "nothing", resolved: "N", favourite: "Y", date_created: "12/12/12" };

        // Mock the Feedback.getFeedbackById function to return mock data
        Feedback.getFeedbackById.mockResolvedValue(mockFeedback);

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            json: jest.fn(), // Mock the res.json function
        };

        await feedbackController.getFeedbackById(req, res);

        expect(Feedback.getFeedbackById).toHaveBeenCalledWith(feedbackId); // Check if getFeedbackById was called with the correct parameter
        expect(res.json).toHaveBeenCalledWith(mockFeedback); // Check the response body
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const feedbackId = 1;
        const errorMessage = "Database error";

        // Simulate an error
        Feedback.getFeedbackById.mockRejectedValue(new Error(errorMessage));

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.getFeedbackById(req, res);

        expect(Feedback.getFeedbackById).toHaveBeenCalledWith(feedbackId); // Check if getFeedbackById was called with the correct parameter
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error in retrieving feedback");
    });

    it("should handle errors and return a 404 status with error message", async () => {
        const feedbackId = 404;

        // Mock the Feedback.getFeedbackById function to return mock data
        Feedback.getFeedbackById.mockResolvedValue(null);

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.getFeedbackById(req, res);

        expect(Feedback.getFeedbackById).toHaveBeenCalledWith(feedbackId); // Check if getFeedbackById was called with the correct parameter
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Feedback not found");
    });
});



// Test case for createFeedback function
describe("feedbackController.createFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // clear mock calls before each test
    });

    it("should create a new feedback and return the created feedback with a 201 status", async () => {
        const newFeedback = {
            id: 2,
            type: "bug",
            name: "jason",
            email: "jason@1.com",
            number: 3322,
            comment: "nothing",
            resolve: "N",
            favourite: "N",
            date_created: "12/12/12"
        };

        // Mock the Feedback.create function to return the created feedback
        Feedback.createFeedback.mockResolvedValue(newFeedback);

        const req = {
            body: newFeedback,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await feedbackController.createFeedback(req, res);

        expect(Feedback.createFeedback).toHaveBeenCalledWith(newFeedback); // Check if create was called with the correct data
        expect(res.status).toHaveBeenCalledWith(201); // Check if the response status is 201
        expect(res.json).toHaveBeenCalledWith(newFeedback); // Check if the response body contains the created feedback
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const newFeedback = {
            type: "bug",
            name: "jason",
            email: "jason@1.com",
            number: 3322,
            comment: "nothing",
            resolve: "N",
            favourite: "N",
            date_created: "12/12/12"
        };

        const errorMessage = "Database error";

        // Simulate an error
        Feedback.createFeedback.mockRejectedValue(new Error(errorMessage));

        const req = {
            body: newFeedback,
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.createFeedback(req, res);

        expect(Feedback.createFeedback).toHaveBeenCalledWith(newFeedback); // Check if create was called with the correct data
        expect(res.status).toHaveBeenCalledWith(500); // Check if the response status is 500
        expect(res.send).toHaveBeenCalledWith("Error creating feedback"); // Check if the response body contains the error message
    });
});


// DeleteFeedback
describe("feedbackController.deleteFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mock calls before each test
    });

    it("should delete a feedback and return a 204 status", async () => {
        const feedbackId = 1;

        // Mock the Feedback.deleteFeedback function to return true
        Feedback.deleteFeedback.mockResolvedValue(true);

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.deleteFeedback(req, res);

        expect(Feedback.deleteFeedback).toHaveBeenCalledWith(feedbackId); // Check if deleteFeedback was called with the correct id
        expect(res.status).toHaveBeenCalledWith(204); // Check if the response status is 204
        expect(res.send).toHaveBeenCalled(); // Check if send was called
    });

    it("should return a 404 status if feedback is not found", async () => {
        const feedbackId = 420; // An ID that does not exist

        // Mock the Feedback.deleteFeedback function to return false
        Feedback.deleteFeedback.mockResolvedValue(false);

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.deleteFeedback(req, res);

        expect(Feedback.deleteFeedback).toHaveBeenCalledWith(feedbackId); // Check if deleteFeedback was called with the correct id
        expect(res.status).toHaveBeenCalledWith(404); // Check if the response status is 404
        expect(res.send).toHaveBeenCalledWith("Feedback not found"); // Check if send was called with the correct message
    });

    it("should handle errors and return a 500 status with error message", async () => {
        const feedbackId = 1;
        const errorMessage = "Database error";

        // Simulate an error
        Feedback.deleteFeedback.mockRejectedValue(new Error(errorMessage));

        const req = {
            params: { id: feedbackId },
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await feedbackController.deleteFeedback(req, res);

        expect(Feedback.deleteFeedback).toHaveBeenCalledWith(feedbackId); // Check if deleteFeedback was called with the correct id
        expect(res.status).toHaveBeenCalledWith(500); // Check if the response status is 500
        expect(res.send).toHaveBeenCalledWith("Error deleting feedback"); // Check if send was called with the correct message
    });
});
