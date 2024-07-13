const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Feedback {
    constructor(id, type, name, email, number, comment, resolve, favourite, date_created){
        this.id = id;
        this.type = type;
        this.name = name;
        this.email = email;
        this.number = number;
        this.comment = comment;
        this.resolve = resolve;
        this.favourite = favourite;
        this.date_created = date_created;
    }

    static async getOngoingFeedback() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Feedback WHERE resolve = @resolve`;

        const request = connection.request();
        request.input("resolve", "N");
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Feedback(row.id,
                row.type,
                row.name,
                row.email,
                row.number,
                row.comment,
                row.resolve,
                row.favourite,
                row.date_created
            )
        );
    }

    static async getResolvedFeedback() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Feedback WHERE resolve = @resolve`;

        const request = connection.request();
        request.input("resolve", "Y");
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Feedback(row.id,
                row.type,
                row.name,
                row.email,
                row.number,
                row.comment,
                row.resolve,
                row.favourite,
                row.date_created
            )
        );
    }

    static async getFeedbackById(id) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Feedback WHERE id = @id`;

        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Feedback(
                result.recordset[0].id,
                result.recordset[0].type,
                result.recordset[0].name,
                result.recordset[0].email,
                result.recordset[0].number,
                result.recordset[0].comment,
                result.recordset[0].resolve,
                result.recordset[0].favourite,
                result.recordset[0].date_created
            )
            : null;
    }

    static async createFeedback(newFeedbackData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Feedback (type, name, email, number, comment) VALUES (@type, @name, @email, @number, @comment);
        SELECT SCOPE_IDENTITY() AS id;`;

        const request = connection.request();
        request.input("type", newFeedbackData.type);
        request.input("name", newFeedbackData.name);
        request.input("email", newFeedbackData.email);
        request.input("number", newFeedbackData.number);
        request.input("comment", newFeedbackData.comment);

        const result = await request.query(sqlQuery);

        connection.close();

        return this.getFeedbackById(result.recordset[0].id);
    }
}

module.exports = Feedback;