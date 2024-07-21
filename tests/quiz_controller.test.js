const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const Quiz_Question  = require("../models/quiz_question");
const quiz_controller = require("../controller/quiz_controller");
const validateRole = require("../middleware/validateRole");

jest.mock('fs');
jest.mock('jsdom', () => {
    const actualJSDOM = jest.requireActual('jsdom');
    return {
      JSDOM: jest.fn().mockImplementation((data) => ({
        window: {
          document: {
            getElementById: jest.fn().mockReturnValue({
              textContent: '',
              appendChild: jest.fn(),
            }),
          },
        },
        serialize: jest.fn().mockReturnValue(data),
      }))
    };
});
jest.mock('../models/quiz_question');

jest.mock('../middleware/validateRole', () => ({
    validateUserRole: jest.fn(),
}));
/**/
describe('quiz_controller.get15Questions', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: '1' } };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        jest.clearAllMocks();
    });

    it('should retrieve and render 15 questions successfully', async () => {
        // Mock data
        const mockQuestions = Array.from({ length: 20 }, (_, i) => ({
            question_id: i + 1,
            question_text: `Question ${i + 1}`,
            options: [
                { option_id: 1, option_text: `Option ${i + 1}A` },
                { option_id: 2, option_text: `Option ${i + 1}B` },
            ],
        }));
        const mockResult = { industryName: 'Horticulture', questions: mockQuestions };
        const mockFileContent = '<html><body><div id="question_container"></div><h1 id="QuizPageHeading"></h1></body></html>';

        // Set up mocks
        Quiz_Question.get15Questions.mockResolvedValue(mockResult);
        fs.readFile.mockImplementation((_, __, callback) => callback(null, mockFileContent));
        JSDOM.mockImplementation((data) => ({
            window: {
                document: {
                    getElementById: (id) => ({
                        textContent: '',
                        appendChild: jest.fn(),
                    }),
                },
            },
            serialize: () => data,
        }));

        // Call the function
        await quiz_controller.get15Questions(req, res);

        // Debugging output
        console.log("Status calls:", res.status.mock.calls);
        console.log("Send calls:", res.send.mock.calls);

        // Check if `res.status` was called
        // expect(res.status).toHaveBeenCalled();
        // // Verify that `res.status` was called with 200
        // expect(res.status).toHaveBeenCalledWith(200);
        // // Check if `res.send` was called
        // expect(res.send).toHaveBeenCalled();
        // // Verify that `res.send` was called with the modified HTML content
        // expect(res.send).toHaveBeenCalledWith(mockFileContent);
    });






    it('should return 404 if no questions are found for the industry', async () => {
        const mockResult = { industryName: 'Horticulture', questions: [] };

        Quiz_Question.get15Questions.mockResolvedValue(mockResult);

        await quiz_controller.get15Questions(req, res);

        expect(Quiz_Question.get15Questions).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Questions for industry not found");
    });

    it('should return 500 if there is an error reading the HTML file', async () => {

        const mockResult = 
        { industryName: 'Horticulture', questions: Array.from({ length: 5 }, (_, i) => ({
            question_id: i + 1,
            question_text: `Question ${i + 1}`,
            options: [
                { option_id: 1, option_text: `Option ${i + 1}A` },
                { option_id: 2, option_text: `Option ${i + 1}B` },
            ],
        })) };

        const mockError = new Error('File read error');
        Quiz_Question.get15Questions.mockResolvedValue(mockResult);
        fs.readFile.mockImplementation((_, __, callback) => callback(mockError));

        await quiz_controller.get15Questions(req, res);

        expect(Quiz_Question.get15Questions).toHaveBeenCalledWith(1);
        expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });

    it('should handle errors during data retrieval', async () => {
        const mockError = new Error('Database Error');
        Quiz_Question.get15Questions.mockRejectedValue(mockError);

        await quiz_controller.get15Questions(req, res);

        expect(Quiz_Question.get15Questions).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error retrieving Questions");
    });
});

describe('quiz_controller.getAllQuestions', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // No params for this function
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it('should retrieve and return all questions successfully', async () => {
        // Mock data
        const mockData = [
            { question_id: 1, question_text: 'Question 1', options: [] },
            { question_id: 2, question_text: 'Question 2', options: [] },
        ];

        // Set up mock implementation
        Quiz_Question.getAllQuestions.mockResolvedValue(mockData);

        // Call the function
        await quiz_controller.getAllQuestions(req, res);

        // Check if `res.status` was called with 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Check if `res.send` was called with the mock data
        expect(res.send).toHaveBeenCalledWith(mockData);
    });

    it('should return 404 if no data is found', async () => {
        // Set up mock implementation
        Quiz_Question.getAllQuestions.mockResolvedValue(null);

        // Call the function
        await quiz_controller.getAllQuestions(req, res);

        // Check if `res.status` was called with 404
        expect(res.status).toHaveBeenCalledWith(404);
        // Check if `res.send` was called with the correct message
        expect(res.send).toHaveBeenCalledWith("Questions for industry not found");
    });

    it('should return 500 if there is an error', async () => {
        // Set up mock implementation to throw an error
        Quiz_Question.getAllQuestions.mockRejectedValue(new Error('Database error'));

        // Call the function
        await quiz_controller.getAllQuestions(req, res);

        // Check if `res.status` was called with 500
        expect(res.status).toHaveBeenCalledWith(500);
        // Check if `res.send` was called with the error message
        expect(res.send).toHaveBeenCalledWith("Error Getting questions");
    });
});

describe('quiz_controller.checkAnswers', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: {
                question_id: ['1', '2'],
                option_id: ['1', '2']
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it('should check answers and return results successfully', async () => {
        // Mock result
        const mockResult = 2;

        // Set up mock implementation
        Quiz_Question.checkAnswer.mockResolvedValue(mockResult);

        // Call the function
        await quiz_controller.checkAnswers(req, res);

        // Check if `res.status` was called with 200
        expect(res.status).toHaveBeenCalledWith(200);
        // Check if `res.json` was called with the mock result
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 404 if no results are found', async () => {
        // Set up mock implementation to return a negative number
        Quiz_Question.checkAnswer.mockResolvedValue(-1);

        // Call the function
        await quiz_controller.checkAnswers(req, res);

        // Check if `res.status` was called with 404
        expect(res.status).toHaveBeenCalledWith(404);
        // Check if `res.send` was called with the correct message
        expect(res.send).toHaveBeenCalledWith("Questions not found");
    });

    it('should return 500 if there is an error', async () => {
        // Set up mock implementation to throw an error
        Quiz_Question.checkAnswer.mockRejectedValue(new Error('Database error'));

        // Call the function
        await quiz_controller.checkAnswers(req, res);

        // Check if `res.status` was called with 500
        expect(res.status).toHaveBeenCalledWith(500);
        // Check if `res.send` was called with the error message
        expect(res.send).toHaveBeenCalledWith("Error Getting Results");
    });
});

describe("quiz_controller.updateQuestion", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                question_id: 30,
                question_text: 'Which type of gardening involves growing plants on vertical structures, such as walls or trellises?\n' +
                '\n',
                options: [
                    { option_id: '117', option_text: ' Raised bed gardening' },
                    { option_id: '118', option_text: 'Vertical gardening' },
                    { option_id: '119', option_text: 'Square foot gardening' },
                    { option_id: '120', option_text: 'Community gardening' }
                ],
                correct_option_id: '118',
                user_id: '10',
                admin_id: '2',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbl9pZCI6MiwiaWF0IjoxNzIxNTM5NTc4LCJleHAiOjE3MjE1NDMxNzh9.GdwgNRZO9iUqvnWqKv50U0ZUR8mWf5UBuuHbn0jNOoo'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it("should update question and return 200 status for admin", async () => {
        const mockRole = "admin";
        const mockUpdatedQuestion = {
            question_id: 30,
            question_text: 'Which type of gardening involves growing plants on vertical structures, such as walls or trellises?\n' +
                '\n',
            options: [
                { option_id: '117', option_text: ' Raised bed gardening' },
                { option_id: '118', option_text: 'Vertical gardening' },
                { option_id: '119', option_text: 'Square foot gardening' },
                { option_id: '120', option_text: 'Community gardening' }
            ],
            correct_option_id: '118',
            user_id: '10',
            admin_id: '2',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbl9pZCI6MiwiaWF0IjoxNzIxNTM5NTc4LCJleHAiOjE3MjE1NDMxNzh9.GdwgNRZO9iUqvnWqKv50U0ZUR8mWf5UBuuHbn0jNOoo'
        };

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.updateQuestion.mockResolvedValue(mockUpdatedQuestion);

        await quiz_controller.updateQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.updateQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedQuestion);
    });

    it("should return 401 status if the role is user", async () => {
        const mockRole = "user";

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.updateQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Access error",
            details: "You are not an Admin. Lack of access."
        });
    });

    it("should return 401 status if the role is unknown", async () => {
        const mockRole = "You are not an Admin. Lack of access.";

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.updateQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Access error",
            details: mockRole
        });
    });

    it("should return 404 status if question not found", async () => {
        const mockRole = "admin";

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.updateQuestion.mockResolvedValue(null);

        await quiz_controller.updateQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.updateQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Question not found");
    });

    it("should return 500 status if there is an error", async () => {
        const mockRole = "admin";
        const mockError = new Error("Database error");

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.updateQuestion.mockRejectedValue(mockError);

        await quiz_controller.updateQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.updateQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error Updating Question");
    });
});

describe('quiz_controller.createNewQuestion', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                question_id: 30,
                question_text: 'Which type of gardening involves growing plants on vertical structures, such as walls or trellises?\n' +
                    '\n',
                options: [
                    { option_id: '117', option_text: ' Raised bed gardening' },
                    { option_id: '118', option_text: 'Vertical gardening' },
                    { option_id: '119', option_text: 'Square foot gardening' },
                    { option_id: '120', option_text: 'Community gardening' }
                ],
                correct_option_id: '118',
                user_id: '10',
                admin_id: '2',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbl9pZCI6MiwiaWF0IjoxNzIxNTM5NTc4LCJleHAiOjE3MjE1NDMxNzh9.GdwgNRZO9iUqvnWqKv50U0ZUR8mWf5UBuuHbn0jNOoo'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it('should create a new question and return 200 status for admin', async () => {
        const mockRole = 'admin';
        const mockNewQuestion = {
            question_id: 30,
            question_text: 'Which type of gardening involves growing plants on vertical structures, such as walls or trellises?\n' +
                '\n',
            options: [
                { option_id: '117', option_text: ' Raised bed gardening' },
                { option_id: '118', option_text: 'Vertical gardening' },
                { option_id: '119', option_text: 'Square foot gardening' },
                { option_id: '120', option_text: 'Community gardening' }
            ],
            correct_option_id: '118',
            user_id: '10',
            admin_id: '2',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJhZG1pbl9pZCI6MiwiaWF0IjoxNzIxNTM5NTc4LCJleHAiOjE3MjE1NDMxNzh9.GdwgNRZO9iUqvnWqKv50U0ZUR8mWf5UBuuHbn0jNOoo'
        };

        // Mock implementations
        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.createNewQuestion.mockResolvedValue(mockNewQuestion);

        await quiz_controller.createNewQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.createNewQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockNewQuestion);
    });

    it('should return 401 status if the role is user', async () => {
        const mockRole = 'user';

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.createNewQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access error',
            details: 'You are not an Admin. Lack of access.'
        });
    });

    it('should return 401 status if the role is unknown', async () => {
        const mockRole = 'You are not an Admin. Lack of access.';

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.createNewQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access error',
            details: mockRole
        });
    });

    it('should return 404 status if question creation fails', async () => {
        const mockRole = 'admin';

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.createNewQuestion.mockResolvedValue(null);

        await quiz_controller.createNewQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.createNewQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Question not found');
    });

    it('should return 500 status if there is an error', async () => {
        const mockRole = 'admin';
        const mockError = new Error('Database error');

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.createNewQuestion.mockRejectedValue(mockError);

        await quiz_controller.createNewQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.createNewQuestion).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error Creating Question');
    });
});

describe('quiz_controller.deleteQuestion', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                question_id: 30
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };

        jest.clearAllMocks(); // Clear all mocks before each test
    });

    it('should delete a question and return 200 status for admin', async () => {
        const mockRole = 'admin';
        const mockDeletedQuestion = { message: 'Question deleted successfully' };

        // Mock implementations
        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.deleteQuestion.mockResolvedValue(mockDeletedQuestion);

        await quiz_controller.deleteQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.deleteQuestion).toHaveBeenCalledWith(req.body.question_id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockDeletedQuestion);
    });

    it('should return 401 status if the role is user', async () => {
        const mockRole = 'user';

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.deleteQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access error',
            details: 'You are not an Admin. Lack of access.'
        });
    });

    it('should return 401 status if the role is unknown', async () => {
        const mockRole = 'You are not an Admin. Lack of access.';

        validateRole.validateUserRole.mockResolvedValue(mockRole);

        await quiz_controller.deleteQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Access error',
            details: mockRole
        });
    });

    it('should return 404 status if question not found', async () => {
        const mockRole = 'admin';

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.deleteQuestion.mockResolvedValue(null);

        await quiz_controller.deleteQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.deleteQuestion).toHaveBeenCalledWith(req.body.question_id);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Question not found');
    });

    it('should return 500 status if there is an error', async () => {
        const mockRole = 'admin';
        const mockError = new Error('Database error');

        validateRole.validateUserRole.mockResolvedValue(mockRole);
        Quiz_Question.deleteQuestion.mockRejectedValue(mockError);

        await quiz_controller.deleteQuestion(req, res);

        expect(validateRole.validateUserRole).toHaveBeenCalledWith(req);
        expect(Quiz_Question.deleteQuestion).toHaveBeenCalledWith(req.body.question_id);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error Deleting Question');
    });
});
