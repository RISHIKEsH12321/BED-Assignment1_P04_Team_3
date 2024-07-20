const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("../dbConfig");

class Book {
    constructor(id, title, author,availability) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.availability = availability;
    }

    static async getAllBooks() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Books`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
        console.log(result.recordset[0]);
        const returnList = result.recordset.map(
            (row) => new Book(row.id, row.title, row.author, row.availability)
        ); // Convert rows to Book objects
        return returnList;
    }

    static async getBookById(id) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Books WHERE book_id = @id`; // Parameterized query
    
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);
    
        connection.close();
        const book = result.recordset[0]
        ? new Book(
            result.recordset[0].book_id,
            result.recordset[0].title,
            result.recordset[0].author,
            result.recordset[0].availability,
        )
        : null; // Handle book not found
        console.log("Book in model" ,book);
        return book;
    }

    static async updateBookAvailability(id, newAvailability) {
        const connection = await sql.connect(dbConfig);
        try{
            
            console.log("newAvailability "+ newAvailability)
    
            const sqlQuery = `UPDATE Books SET availability = @availability WHERE book_id = @id`; // Parameterized query
            
            const request = connection.request();
            request.input("availability", sql.Char, newAvailability);
            request.input("id", sql.Int, id);
            
            await request.query(sqlQuery);
            
            connection.close();
            
            return await this.getBookById(id); // returning the updated book data
        }catch(err){
            console.error("Error updating book availability:", err);
            connection.close();

            throw new Error("Database error");    
        }

    }
    

    static async deleteBook(id) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM Books WHERE id = @id`; // Parameterized query

    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
    }
}

module.exports = Book;