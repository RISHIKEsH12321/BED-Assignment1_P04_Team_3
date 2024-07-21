const sql = require('mssql');
const Quiz_Question = require('../models/quiz_question');

// Mock the mssql module
jest.mock('mssql');
/**/
describe('Quiz_Question.get15Questions', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            input: jest.fn().mockReturnThis(),
            query: jest.fn()
        };
        
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };
        
        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return questions and industry name', async () => {
        // Define the mock data
        const mockQuestionsResult = {
            recordset: [
                { question_id: 1, question_text: 'Question 1', option_id: 1, option_text: 'Option 1' },
                { question_id: 1, question_text: 'Question 1', option_id: 2, option_text: 'Option 2' },
                { question_id: 2, question_text: 'Question 2', option_id: 3, option_text: 'Option 3' }
            ]
        };

        const mockIndustryResult = {
            recordset: [
                { industry_name: 'Industry 1' }
            ]
        };

        // Mock the queries
        mockRequest.query
            .mockResolvedValueOnce(mockQuestionsResult) // First query
            .mockResolvedValueOnce(mockIndustryResult); // Second query

        // Call the method
        const result = await Quiz_Question.get15Questions(1);

        // Check the results
        expect(result).toEqual({
            questions: [
                {
                    question_id: 1,
                    question_text: 'Question 1',
                    options: [
                        { option_id: 1, option_text: 'Option 1' },
                        { option_id: 2, option_text: 'Option 2' }
                    ]
                },
                {
                    question_id: 2,
                    question_text: 'Question 2',
                    options: [
                        { option_id: 3, option_text: 'Option 3' }
                    ]
                }
            ],
            industryName: 'Industry 1'
        });

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if query fails', async () => {
        // Mock the queries to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Database query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.get15Questions(1)).rejects.toThrow('Database query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

describe('Quiz_Question.getAllQuestions', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            query: jest.fn()
        };
        
        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };
        
        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return all questions with industry names', async () => {
        // Define the mock data
        const mockResult = {
            recordset: [
                { industry_id: 1, industry_name: 'Industry 1', question_id: 1, question_text: 'Question 1', option_id: 1, option_text: 'Option 1', correct_option_id: 1 },
                { industry_id: 1, industry_name: 'Industry 1', question_id: 1, question_text: 'Question 1', option_id: 2, option_text: 'Option 2', correct_option_id: 1 },
                { industry_id: 1, industry_name: 'Industry 1', question_id: 2, question_text: 'Question 2', option_id: 3, option_text: 'Option 3', correct_option_id: null },
                { industry_id: 2, industry_name: 'Industry 2', question_id: 3, question_text: 'Question 3', option_id: 4, option_text: 'Option 4', correct_option_id: 4 }
            ]
        };

        // Mock the query result
        mockRequest.query.mockResolvedValueOnce(mockResult);

        // Call the method
        const result = await Quiz_Question.getAllQuestions();

        // Check the results
        expect(result).toEqual([
            {
                industry_id: 1,
                industry_name: 'Industry 1',
                questions: [
                    {
                        question_id: 1,
                        question_text: 'Question 1',
                        options: [
                            { option_id: 1, option_text: 'Option 1' },
                            { option_id: 2, option_text: 'Option 2' }
                        ],
                        correct_option_id: 1
                    },
                    {
                        question_id: 2,
                        question_text: 'Question 2',
                        options: [
                            { option_id: 3, option_text: 'Option 3' }
                        ],
                        correct_option_id: null
                    }
                ]
            },
            {
                industry_id: 2,
                industry_name: 'Industry 2',
                questions: [
                    {
                        question_id: 3,
                        question_text: 'Question 3',
                        options: [
                            { option_id: 4, option_text: 'Option 4' }
                        ],
                        correct_option_id: 4
                    }
                ]
            }
        ]);

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if query fails', async () => {
        // Mock the query to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Database query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.getAllQuestions()).rejects.toThrow('Database query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

describe('Quiz_Question.updateQuestion', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            input: jest.fn().mockReturnThis(),  // Ensure input returns `this` for chaining
            query: jest.fn()
        };

        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };

        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should update question, options, and correct answer', async () => {
        // Define the mock data
        const data = {
            question_id: 1,
            question_text: 'Updated Question Text',
            options: [
                { option_id: 1, option_text: 'Updated Option 1' },
                { option_id: 2, option_text: 'Updated Option 2' }
            ],
            correct_option_id: 1
        };

        // Mock the query results
        mockRequest.query.mockResolvedValueOnce({}); // Mock updateQuestionQuery
        mockRequest.query.mockResolvedValueOnce({}); // Mock updateOptionQuery
        mockRequest.query.mockResolvedValueOnce({}); // Mock updateCorrectAnswerQuery

        // Call the method
        const result = await Quiz_Question.updateQuestion(data);

        // Check the results
        expect(result).toBe(true);

        // Ensure the update queries were called with the correct parameters
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Questions'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Options'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Correct_Answers'));

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if query fails', async () => {
        // Mock the queries to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Update question query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.updateQuestion({
            question_id: 1,
            question_text: 'Updated Question Text',
            options: [{ option_id: 1, option_text: 'Updated Option 1' }],
            correct_option_id: 1
        })).rejects.toThrow('Update question query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

describe('Quiz_Question.createNewQuestion', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            input: jest.fn().mockReturnThis(),  // Ensure input returns `this` for chaining
            query: jest.fn()
        };

        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };

        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should create a new question and insert options and correct answer', async () => {
        // Define the mock data
        const data = {
            industry_id: 1,
            question_text: 'What is the capital of France?',
            options: [
                { option_text: 'Paris' },
                { option_text: 'London' },
                { option_text: 'Berlin' }
            ],
            correct_option_id: 1
        };

        // Mock the query results
        mockRequest.query
            .mockResolvedValueOnce({ recordset: [{ question_id: 101 }] }) // Mock insertQuestionQuery
            .mockResolvedValueOnce({ recordset: [{ option_id: 201 }] }) // Mock first insertOptionQuery
            .mockResolvedValueOnce({ recordset: [{ option_id: 202 }] }) // Mock second insertOptionQuery
            .mockResolvedValueOnce({ recordset: [{ option_id: 203 }] }) // Mock third insertOptionQuery
            .mockResolvedValueOnce({}); // Mock insertCorrectAnswerQuery

        // Call the method
        const questionId = await Quiz_Question.createNewQuestion(data);

        // Check the results
        expect(questionId).toBe(101);

        // Ensure the insert queries were called with the correct parameters
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO Questions'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO Options'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO Correct_Answers'));

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if an insert query fails', async () => {
        // Define the mock data
        const data = {
            industry_id: 1,
            question_text: 'What is the capital of France?',
            options: [
                { option_text: 'Paris' },
                { option_text: 'London' },
                { option_text: 'Berlin' }
            ],
            correct_option_id: 1
        };

        // Mock the query results to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Insert question query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.createNewQuestion(data)).rejects.toThrow('Insert question query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

describe('Quiz_Question.deleteQuestion', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            input: jest.fn().mockReturnThis(),  // Ensure input returns `this` for chaining
            query: jest.fn()
        };

        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };

        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should delete a question, its options, and correct answer', async () => {
        // Define the question_id to delete
        const questionId = 1;

        // Mock the query results
        mockRequest.query
            .mockResolvedValueOnce({}) // Mock deleteCorrectAnswerQuery
            .mockResolvedValueOnce({}) // Mock deleteOptionsQuery
            .mockResolvedValueOnce({}); // Mock deleteQuestionQuery

        // Call the method
        const result = await Quiz_Question.deleteQuestion(questionId);

        // Check the result
        expect(result).toBe(true);

        // Ensure the delete queries were called with the correct parameters
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Correct_Answers'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Options'));
        expect(mockRequest.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM Questions'));

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if a delete query fails', async () => {
        // Define the question_id to delete
        const questionId = 1;

        // Mock the query results to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Delete correct answer query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.deleteQuestion(questionId)).rejects.toThrow('Delete correct answer query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

describe('Quiz_Question.checkAnswer', () => {
    let mockConnection;
    let mockRequest;

    beforeEach(() => {
        // Create mock connection and request
        mockRequest = {
            input: jest.fn().mockReturnThis(),  // Ensure input returns `this` for chaining
            query: jest.fn()
        };

        mockConnection = {
            request: jest.fn().mockReturnValue(mockRequest),
            close: jest.fn()
        };

        // Mock the sql.connect function to return the mock connection
        sql.connect.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should return the count of correct answers', async () => {
        // Define test data
        const data = [
            { question_id: 1, option_id: 2 },
            { question_id: 3, option_id: 4 }
        ];

        // Mock the query result
        mockRequest.query.mockResolvedValueOnce({
            recordset: [{ correct_count: 2 }]
        });

        // Call the method
        const result = await Quiz_Question.checkAnswer(data);

        // Check the result
        expect(result).toBe(2);

        // Ensure input parameters were set correctly
        data.forEach((_, index) => {
            expect(mockRequest.input).toHaveBeenCalledWith(`questionId${index}`, data[index].question_id);
            expect(mockRequest.input).toHaveBeenCalledWith(`optionId${index}`, data[index].option_id);
        });

        // Normalize expected and received queries
        const normalizeQuery = (query) => query.replace(/\s+/g, ' ').trim();

        const receivedQuery = mockRequest.query.mock.calls[0][0];
        const expectedQuery = `
            SELECT COUNT(*) AS correct_count
            FROM Correct_Answers ca
            WHERE EXISTS (
                SELECT 1
                FROM (VALUES (@questionId0),(@questionId1)) AS q(question_id)
                WHERE q.question_id = ca.question_id
            ) AND EXISTS (
                SELECT 1
                FROM (VALUES (@optionId0),(@optionId1)) AS o(option_id)
                WHERE o.option_id = ca.correct_option_id
            );
        `;

        expect(normalizeQuery(receivedQuery)).toBe(normalizeQuery(expectedQuery));

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });

    it('should throw an error if the query fails', async () => {
        // Define test data
        const data = [
            { question_id: 1, option_id: 2 },
            { question_id: 3, option_id: 4 }
        ];

        // Mock the query result to throw an error
        mockRequest.query.mockRejectedValueOnce(new Error('Query failed'));

        // Call the method and expect it to throw an error
        await expect(Quiz_Question.checkAnswer(data)).rejects.toThrow('Query failed');

        // Ensure connection was closed
        expect(mockConnection.close).toHaveBeenCalled();
    });
});

