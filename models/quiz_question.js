const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Quiz_Question{
    constructor(industry_id, question_id, question_text, options, correct_option) {
        this.industry_id = industry_id;
        this.question_id = question_id;
        this.question_text = question_text;
        this.options = options;
        this.correct_option = correct_option;

    }

        
    static async get15Questions(id) {
        try{
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
        SELECT 
            q.question_id, 
            q.question_text, 
            o.option_id, 
            o.option_text, 
            ca.correct_option_id 
        FROM 
            Questions q
        LEFT JOIN 
            Options o ON q.question_id = o.question_id
        LEFT JOIN 
            Correct_Answers ca ON q.question_id = ca.question_id AND o.option_id = ca.correct_option_id
        WHERE 
            q.industry_id = @id
        ORDER BY 
            q.question_id
        `;

    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset;
        }catch (err){
            console.log(err);
            throw err;
        }
    }

    static async updateQuestion(data){
        try {
            const connection = await sql.connect(dbConfig);

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
                optionRequest.input("option_text",data.options.option_text);
                optionRequest.input("option_id", data.options.option_id);
                await optionRequest.query(updateOptionQuery);
            }

            // Update correct answer
            const updateCorrectAnswerQuery = `
                UPDATE Correct_Answers
                SET correct_option_id = @correct_option_id
                WHERE question_id = @question_id;
            `;
            const correctAnswerRequest = connection.request();
            correctAnswerRequest.input("correct_option_id",data.correct_option_id);
            correctAnswerRequest.input("question_id", data.question_id);
            await correctAnswerRequest.query(updateCorrectAnswerQuery);

            connection.close();

            return true; 
        } catch (error) {
            console.error("Error updating question:", error);
            throw error; 
        }

        /*
        Sample Data
        {
            "question_id":1,
            "question_text": "PUT Question (Update)",
            "options":[
                {
                    "option_id": 1,
                    "option_text":"Option 1"
                },        {
                    "option_id": 2,
                    "option_text":"Option 2"
                },        {
                    "option_id": 3,
                    "option_text":"Option 3"
                },        {
                    "option_id": 4,
                    "option_text":"Option 4"
                }
            ],
            "correct_option_id": 1
        }   
        */
    }

    static async createNewQuestion(data) {
        try {
            const connection = await sql.connect(dbConfig);

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
            console.log("question_id: " + question_id);

            // Insert options
            const insertOptionQuery = `
                INSERT INTO Options (question_id, option_text)
                VALUES (@question_id, @option_text);
            `;
            for (const option of data.options) {
                const optionRequest = connection.request();
                await optionRequest
                    .input("question_id", question_id)
                    .input("option_text", option.option_text)
                    .query(insertOptionQuery);
            }

            // Insert the correct answer
            const insertCorrectAnswerQuery = `
                INSERT INTO Correct_Answers (question_id, correct_option_id)
                VALUES (@question_id, @correct_option_id);
            `;
            const correctAnswerRequest = connection.request();
            await correctAnswerRequest
                .input("question_id", question_id)
                .input("correct_option_id", sql.Int, data.correct_option_id)
                .query(insertCorrectAnswerQuery);

            connection.close();

            return question_id;
        } catch (error) {
            console.error("Error creating question:", error);
            throw error;
        }

        /*
        Example Data
        {
        "industry_id":2,
        "question_text": "POST Question (Update) 2",
        "options":[
            {
                "option_id": 1,
                "option_text":"Option 1"
            },        {
                "option_id": 2,
                "option_text":"Option 2"
            },        {
                "option_id": 3,
                "option_text":"Option 3"
            },        {
                "option_id": 4,
                "option_text":"Option 4"
            }
        ],
        "correct_option_id": 2
        }
        */
    }

    static async deleteQuestion(question_id) {
        try {
            const connection = await sql.connect(dbConfig);

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

            connection.close();

            return true;
        } catch (error) {
            console.error("Error deleting question:", error);
            throw error;
        }
    }


}


module.exports = Quiz_Question;