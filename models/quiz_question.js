const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Quiz_Question {
    constructor(industry_id, question_id, question_text, options, correct_option) {
        this.industry_id = industry_id;
        this.question_id = question_id;
        this.question_text = question_text;
        this.options = options;
        this.correct_option = correct_option;
    }

    static async get15Questions(id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `
                SELECT 
                    q.question_id, 
                    q.question_text, 
                    o.option_id, 
                    o.option_text
                FROM 
                    Questions q
                LEFT JOIN 
                    Options o ON q.question_id = o.question_id
                WHERE 
                    q.industry_id = @id
                ORDER BY 
                    q.question_id
            `;

            const request = connection.request();
            request.input("id", id);
            const result = await request.query(sqlQuery);

            const nameQuery = `
                SELECT industry_name
                FROM Industry_Info
                WHERE industry_id = @id_industry;
            `;

            const request2 = connection.request();
            request2.input("id_industry", id);
            const result2 = await request2.query(nameQuery);
            let industryName = null;
            if (result2.recordset[0] != null) {
                industryName = result2.recordset[0].industry_name;
            }

            const questionsMap = new Map();
            result.recordset.forEach(row => {
                if (!questionsMap.has(row.question_id)) {
                    questionsMap.set(row.question_id, {
                        question_id: row.question_id,
                        question_text: row.question_text,
                        options: []
                    });
                }

                const question = questionsMap.get(row.question_id);
                question.options.push({
                    option_id: row.option_id,
                    option_text: row.option_text
                });
            });

            const returnData = {
                questions: Array.from(questionsMap.values()),
                industryName: industryName
            }
            return returnData;

        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async getAllQuestions() {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const sqlQuery = `
                SELECT 
                    i.industry_id,
                    i.industry_name,
                    q.question_id, 
                    q.question_text, 
                    o.option_id, 
                    o.option_text, 
                    ca.correct_option_id 
                FROM 
                    Industry_Info i
                LEFT JOIN 
                    Questions q ON i.industry_id = q.industry_id
                LEFT JOIN 
                    Options o ON q.question_id = o.question_id
                LEFT JOIN 
                    Correct_Answers ca ON q.question_id = ca.question_id
                ORDER BY 
                    i.industry_id, q.question_id
            `;

            const result = await connection.request().query(sqlQuery);
            const industriesMap = new Map();

            result.recordset.forEach(row => {
                if (!industriesMap.has(row.industry_id)) {
                    industriesMap.set(row.industry_id, {
                        industry_id: row.industry_id,
                        industry_name: row.industry_name,
                        questions: []
                    });
                }

                const industry = industriesMap.get(row.industry_id);

                let question = industry.questions.find(q => q.question_id === row.question_id);
                if (!question) {
                    question = {
                        question_id: row.question_id,
                        question_text: row.question_text,
                        options: [],
                        correct_option_id: row.correct_option_id
                    };
                    industry.questions.push(question);
                }

                question.options.push({
                    option_id: row.option_id,
                    option_text: row.option_text
                });

                if (!question.correct_option_id && row.correct_option_id === row.option_id) {
                    question.correct_option_id = row.correct_option_id;
                }
            });

            return Array.from(industriesMap.values());

        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async updateQuestion(data) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            // Update question text
            const updateQuestionQuery = `
                UPDATE Questions
                SET question_text = @question_text
                WHERE question_id = @question_id;
            `;
            const request = connection.request();
            request.input("question_text", data.question_text);
            request.input("question_id", data.question_id);
            await request.query(updateQuestionQuery);

            // Update options
            for (const option of data.options) {
                const updateOptionQuery = `
                    UPDATE Options
                    SET option_text = @option_text
                    WHERE option_id = @option_id;
                `;
                const optionRequest = connection.request();
                optionRequest.input("option_text", option.option_text);
                optionRequest.input("option_id", option.option_id);
                await optionRequest.query(updateOptionQuery);
            }

            // Update correct answer
            const updateCorrectAnswerQuery = `
                UPDATE Correct_Answers
                SET correct_option_id = @correct_option_id
                WHERE question_id = @question_id;
            `;

            const correctAnswerRequest = connection.request();
            correctAnswerRequest.input("correct_option_id", data.correct_option_id);
            correctAnswerRequest.input("question_id", data.question_id);
            await correctAnswerRequest.query(updateCorrectAnswerQuery);

            return true;
        } catch (error) {
            console.error("Error updating question:", error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async createNewQuestion(data) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            // Insert question and get the question_id
            const insertQuestionQuery = `
                INSERT INTO Questions (industry_id, question_text)
                VALUES (@industry_id, @question_text);
                SELECT SCOPE_IDENTITY() AS question_id;
            `;
            const request = connection.request();
            const result = await request
                .input("industry_id", data.industry_id)
                .input("question_text", data.question_text)
                .query(insertQuestionQuery);

            const question_id = result.recordset[0].question_id;

            // Insert options
            const insertOptionQuery = `
                INSERT INTO Options (question_id, option_text)
                VALUES (@question_id, @option_text);
                SELECT SCOPE_IDENTITY() AS option_id;
            `;
            const optionIDs = [];
            for (const [index, option] of data.options.entries()) {
                const optionRequest = connection.request();
                const optionResult = await optionRequest
                    .input("question_id", question_id)
                    .input("option_text", option.option_text)
                    .query(insertOptionQuery);
                const insertedOptionID = optionResult.recordset[0].option_id;
                optionIDs.push(insertedOptionID);
                if (index === data.correct_option_id - 1) {
                    data.correct_option_id = insertedOptionID;
                }
            }

            // Insert the correct answer
            const insertCorrectAnswerQuery = `
                INSERT INTO Correct_Answers (question_id, correct_option_id)
                VALUES (@question_id, @correct_option_id);
            `;
            const correctAnswerRequest = connection.request();
            await correctAnswerRequest
                .input("question_id", question_id)
                .input("correct_option_id", data.correct_option_id)
                .query(insertCorrectAnswerQuery);

            return question_id;
        } catch (error) {
            console.error("Error creating question:", error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async deleteQuestion(question_id) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            // Delete correct answer
            const deleteCorrectAnswerQuery = `
                DELETE FROM Correct_Answers
                WHERE question_id = @question_id;
            `;
            const correctAnswerRequest = connection.request();
            await correctAnswerRequest.input("question_id", sql.Int, question_id).query(deleteCorrectAnswerQuery);

            // Delete options
            const deleteOptionsQuery = `
                DELETE FROM Options
                WHERE question_id = @question_id;
            `;
            const optionsRequest = connection.request();
            await optionsRequest.input("question_id", sql.Int, question_id).query(deleteOptionsQuery);

            // Delete question
            const deleteQuestionQuery = `
                DELETE FROM Questions
                WHERE question_id = @question_id;
            `;
            const questionRequest = connection.request();
            await questionRequest.input("question_id", sql.Int, question_id).query(deleteQuestionQuery);

            return true;
        } catch (error) {
            console.error("Error deleting question:", error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }

    static async checkAnswer(data) {
        let connection;
        try {
            connection = await sql.connect(dbConfig);

            const questionParams = data.map((_, index) => `(@questionId${index})`).join(',');
            const optionParams = data.map((_, index) => `(@optionId${index})`).join(',');

            const query = `
                SELECT COUNT(*) AS correct_count
                FROM Correct_Answers ca
                WHERE EXISTS (
                    SELECT 1
                    FROM (VALUES ${questionParams}) AS q(question_id)
                    WHERE q.question_id = ca.question_id
                ) AND EXISTS (
                    SELECT 1
                    FROM (VALUES ${optionParams}) AS o(option_id)
                    WHERE o.option_id = ca.correct_option_id
                );
            `;

            const request = connection.request();
            data.forEach((q, index) => {
                request.input(`questionId${index}`, q.question_id);
                request.input(`optionId${index}`, q.option_id);
            });

            const result = await request.query(query);

            return result.recordset[0].correct_count;
        } catch (error) {
            console.error("Error checking answers", error);
            throw error;
        } finally {
            if (connection) {
                connection.close();
            }
        }
    }
}

module.exports = Quiz_Question;
