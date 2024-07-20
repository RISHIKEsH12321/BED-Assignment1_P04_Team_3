// book.test.js
const Book = require("../models/book");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();
    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0]).toBeInstanceOf(Book);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

describe("updateBookAvailability", () => {

    beforeEach(() => {
        jest.clearAllMocks();
      });
    it("should update the availability of a book and return the updated book", async () => {
    const mockBook = {
        book_id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
    };

    const updatedMockBook = {
        ...mockBook,
        availability: "N",
    };

    const mockRequest = {
        input: jest.fn(),
        query: jest.fn()
        .mockResolvedValueOnce({ rowsAffected: [1] }) // For the update query
        .mockResolvedValueOnce({ recordset: [updatedMockBook] }), // For the getBookById query
    };
    const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const book = await Book.updateBookAvailability(1, "N");

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(2); // Once for the update and once for the getBookById
    expect(book).toBeInstanceOf(Book);
    expect(book.id).toBe(1);
    expect(book.title).toBe("The Lord of the Rings");
    expect(book.author).toBe("J.R.R. Tolkien");
    expect(book.availability).toBe("N");
    });

    it("should throw an error if the update fails", async () => {
    const mockRequest = {
        input: jest.fn(),
        query: jest.fn().mockRejectedValue(new Error("Database error")),
    };
    const mockConnection = {
        request: jest.fn().mockReturnValue(mockRequest),
        close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    await expect(Book.updateBookAvailability(1, "N")).rejects.toThrow("Database error");

    // console.log(book); // Debugging log

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1); // Only once because the update failed
    });

});
