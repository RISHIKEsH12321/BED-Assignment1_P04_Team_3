const Feedback = require("../models/feedback");
const sql = require("mssql");

jest.mock("mssql"); // mock the mssql library

describe("Feedback.getOngoingFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all ongoing feedbacks from the database", async () => {
        const mockFeedback = [
            {
                id: 2,
                type: "bug",
                name: "jason",
                email: "jason@2.com",
                number: 3322,
                comment: "nothing",
                resolve: "N",
                favourite: "N",
                date_created: "12/12/12"
            },
            {
                id: 3,
                type: "article",
                name: "jack",
                email: "jack@3.com",
                number: 1234,
                comment: "okay",
                resolve: "N",
                favourite: "Y",
                date_created: "11/11/11"
            },
        ];

        const mockRequest = {
            input: jest.fn().mockReturnThis(), // mock the input method
            query: jest.fn().mockResolvedValue( { recordset: mockFeedback }),
        };
        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined),
        };

        sql.connect.mockResolvedValue(mockConnection); // return the mock connection

        const feedbacks = await Feedback.getOngoingFeedback();

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(feedbacks).toHaveLength(2);
        expect(feedbacks[0]).toBeInstanceOf(Feedback);
        expect(feedbacks[0].id).toBe(2);
        expect(feedbacks[0].type).toBe("bug");
        expect(feedbacks[0].name).toBe("jason");
        expect(feedbacks[0].email).toBe("jason@2.com");
        expect(feedbacks[0].number).toBe(3322);
        expect(feedbacks[0].comment).toBe("nothing");
        expect(feedbacks[0].resolve).toBe("N");
        expect(feedbacks[0].favourite).toBe("N");
        expect(feedbacks[0].date_created).toBe("12/12/12");
    });

    it("should handle errors when retrieving feedbacks", async () => {
        const errorMessage = "Database Error";
        sql.connect.mockRejectedValue(new Error(errorMessage));
        await expect(Feedback.getOngoingFeedback()).rejects.toThrow(errorMessage);
    });
});


describe("Feedback.updateResolve", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the resolve of a specific feedback and return the updated feedback", async () => {
        const feedbackId = 1;
        const newResolve = { resolve: 'Y' };
        const mockFeedback = {
            id: 1,
            type: "bug",
            name: "jason",
            email: "jason@2.com",
            number: 3322,
            comment: "nothing",
            resolve: "Y",
            favourite: "N",
            date_created: "12/12/12"
        };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [mockFeedback] })
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        const result = await Feedback.updateResolve(feedbackId, newResolve);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.input).toHaveBeenCalledWith("resolve", newResolve.resolve);
        expect(mockRequest.query).toHaveBeenCalledWith(`UPDATE Feedback SET resolve = @resolve WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockFeedback);
    });

    it("should handle errors and throw an exception", async () => {
        const feedbackId = 1;
        const newResolve = { resolve: 'Y' };
        const errorMessage = "Database error";

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockRejectedValue(new Error(errorMessage))
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        await expect(Feedback.updateResolve(feedbackId, newResolve)).rejects.toThrow(errorMessage);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.input).toHaveBeenCalledWith("resolve", newResolve.resolve);
        expect(mockRequest.query).toHaveBeenCalledWith(`UPDATE Feedback SET resolve = @resolve WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(0);
    });

    it("should return null if feedback with the given id does not exist", async () => {
        const feedbackId = 420;
        const newResolve = { resolve: 'Y' };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [] })
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        const result = await Feedback.updateResolve(feedbackId, newResolve);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.input).toHaveBeenCalledWith("resolve", newResolve.resolve);
        expect(mockRequest.query).toHaveBeenCalledWith(`UPDATE Feedback SET resolve = @resolve WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(2);
        expect(result).toBeNull();
    });
});


// createFeedback
describe("Feedback.createFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new feedback and return the created feedback", async () => {
        const newFeedbackData = {
            type: "bug",
            name: "jason",
            email: "jason@2.com",
            number: 3322,
            comment: "nothing"
        };
        
        const createdFeedbackId = 1;
        const mockFeedback = {
            id: createdFeedbackId,
            type: "bug",
            name: "jason",
            email: "jason@2.com",
            number: 3322,
            comment: "nothing",
            resolved: "N",
            favourite: "N",
            date_created: "12/12/12"
        };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [{ id: createdFeedbackId }] })
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);
        jest.spyOn(Feedback, 'getFeedbackById').mockResolvedValue(mockFeedback);

        const result = await Feedback.createFeedback(newFeedbackData);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("type", newFeedbackData.type);
        expect(mockRequest.input).toHaveBeenCalledWith("name", newFeedbackData.name);
        expect(mockRequest.input).toHaveBeenCalledWith("email", newFeedbackData.email);
        expect(mockRequest.input).toHaveBeenCalledWith("number", newFeedbackData.number);
        expect(mockRequest.input).toHaveBeenCalledWith("comment", newFeedbackData.comment);
        expect(mockRequest.query).toHaveBeenCalledWith(`INSERT INTO Feedback (type, name, email, number, comment) VALUES (@type, @name, @email, @number, @comment);
        SELECT SCOPE_IDENTITY() AS id;`);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(Feedback.getFeedbackById).toHaveBeenCalledWith(createdFeedbackId);
        expect(result).toEqual(mockFeedback);
    });

    it("should handle errors and throw an exception", async () => {
        const newFeedbackData = {
            type: "bug",
            name: "jason",
            email: "jason@2.com",
            number: 3322,
            comment: "nothing"
        };
        const errorMessage = "Database error";

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockRejectedValue(new Error(errorMessage))
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        await expect(Feedback.createFeedback(newFeedbackData)).rejects.toThrow(errorMessage);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("type", newFeedbackData.type);
        expect(mockRequest.input).toHaveBeenCalledWith("name", newFeedbackData.name);
        expect(mockRequest.input).toHaveBeenCalledWith("email", newFeedbackData.email);
        expect(mockRequest.input).toHaveBeenCalledWith("number", newFeedbackData.number);
        expect(mockRequest.input).toHaveBeenCalledWith("comment", newFeedbackData.comment);
        expect(mockRequest.query).toHaveBeenCalledWith(`INSERT INTO Feedback (type, name, email, number, comment) VALUES (@type, @name, @email, @number, @comment);
        SELECT SCOPE_IDENTITY() AS id;`);
        expect(mockConnection.close).toHaveBeenCalledTimes(0);
    });
});



describe("Feedback.deleteFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the feedback and return true if feedback is found and deleted", async () => {
        const feedbackId = 1;
        const mockResult = { rowsAffected: [1] };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue(mockResult)
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        const result = await Feedback.deleteFeedback(feedbackId);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.query).toHaveBeenCalledWith(`DELETE FROM Feedback WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });

    it("should handle errors and throw an exception", async () => {
        const feedbackId = 1;
        const errorMessage = "Database error";

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockRejectedValue(new Error(errorMessage))
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        await expect(Feedback.deleteFeedback(feedbackId)).rejects.toThrow(errorMessage);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.query).toHaveBeenCalledWith(`DELETE FROM Feedback WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(0);
    });

    it("should return false if feedback with the given id does not exist", async () => {
        const feedbackId = 404;
        const mockResult = { rowsAffected: [0] };

        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue(mockResult)
        };

        const mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn().mockResolvedValue(undefined)
        };

        sql.connect.mockResolvedValue(mockConnection);

        const result = await Feedback.deleteFeedback(feedbackId);

        expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
        expect(mockRequest.input).toHaveBeenCalledWith("id", feedbackId);
        expect(mockRequest.query).toHaveBeenCalledWith(`DELETE FROM Feedback WHERE id = @id`);
        expect(mockConnection.close).toHaveBeenCalledTimes(1);
        expect(result).toBe(false);
    });
})

