// booksController.test.js
const booksController = require("../controllers/booksControlelr.js");
const Book = require("../models/book.js");

// Mock the Book model
jest.mock("../models/Book"); // Replace with the actual path to your Book model



describe("booksController.updateBookAvalibility", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should update the book availability and return the updated book", async () => {
    const bookId = 1;
    const newAvailability = "N";
    const updatedBook = {
      id: bookId,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      availability: newAvailability
    };

    // Mock the Book.updateBookAvailability function to return the updated book
    Book.updateBookAvailability.mockResolvedValue(updatedBook);

    const req = {
      params: { bookId: bookId.toString() }, // Convert to string as parseInt expects a string
      body: { newAvailability: newAvailability }
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
      status: jest.fn().mockReturnThis() // Mock the res.status function to return res for chaining
    };

    await booksController.updateBookAvalibility(req, res);

    // Extract the response JSON from the mock calls
    const responseJson = res.json.mock.calls[0][0];

    // Log the entire response JSON
    // console.log("Response JSON:", responseJson);

    // Check if updateBookAvailability was called with correct arguments
    expect(Book.updateBookAvailability).toHaveBeenCalledWith(bookId, newAvailability);
    // Check if res.json was called with the updated book
    expect(res.json).toHaveBeenCalledWith(updatedBook);
  });

  it("should return 404 if the book was not found", async () => {
    const bookId = 1;
    const newAvailability = "N";

    // Mock the Book.updateBookAvailability function to return null (book not found)
    Book.updateBookAvailability.mockResolvedValue(null);

    const req = {
      params: { bookId: bookId.toString() }, // Convert to string as parseInt expects a string
      body: { newAvailability: newAvailability }
    };
    const res = {
      send: jest.fn(), // Mock the res.send function
      status: jest.fn().mockReturnThis() // Mock the res.status function to return res for chaining
    };

    await booksController.updateBookAvalibility(req, res);

    // Check if updateBookAvailability was called with correct arguments
    expect(Book.updateBookAvailability).toHaveBeenCalledWith(bookId, newAvailability);
    // Check if res.status was called with 404
    expect(res.status).toHaveBeenCalledWith(404);
    // Check if res.send was called with "Book not found."
    expect(res.send).toHaveBeenCalledWith("Book not found.");
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const bookId = 1;
    const newAvailability = "N";
    const errorMessage = "Database error";

    // Mock the Book.updateBookAvailability function to throw an error
    Book.updateBookAvailability.mockRejectedValue(new Error(errorMessage));

    const req = {
      params: { bookId: bookId.toString() }, // Convert to string as parseInt expects a string
      body: { newAvailability: newAvailability }
    };
    const res = {
      send: jest.fn(), // Mock the res.send function
      status: jest.fn().mockReturnThis() // Mock the res.status function to return res for chaining
    };

    await booksController.updateBookAvalibility(req, res);

    // Check if updateBookAvailability was called with correct arguments
    expect(Book.updateBookAvailability).toHaveBeenCalledWith(bookId, newAvailability);
    // Check if res.status was called with 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Check if res.send was called with "Error updating book"
    expect(res.send).toHaveBeenCalledWith("Error updating book");
  });
});




describe("booksController.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it("should fetch all books and return a JSON response", async () => {
    const mockBooks = {
      role: 'user',
      books: [
        { id: 1, title: "The Lord of the Rings", author: 'J.R.R. Tolkien', availability: 'Y' },
        { id: 2, title: "The Hitchhiker's Guide to the Galaxy", author: 'Douglas Adams', availability: 'Y' }
      ]
    };

    // Mock the Book.getAllBooks function to return the mock data
    Book.getAllBooks.mockResolvedValue(mockBooks);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzIxNDczOTk4LCJleHAiOjE3MjE0Nzc1OTh9.A6UJs2HeLm4_8wGHLczIpQDgnhABcfnUWY1JNRfVWaY";
    const req = {
      headers: { authorization: `Bearer ${token}` }, // Correct token
      user: { role: "user" } // Mock user role
    };
    const res = {
      json: jest.fn(), // Mock the res.json function
      status: jest.fn().mockReturnThis(), // Mock the res.status function to return res for chaining
    };

    await booksController.getAllBooks(req, res);

    // Check if getAllBooks was called
    expect(Book.getAllBooks).toHaveBeenCalledTimes(1); 
    // Check the response body
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  it("should handle errors and return a 500 status with error message", async () => {
    const errorMessage = "Database error";
    Book.getAllBooks.mockRejectedValue(new Error(errorMessage)); // Simulate an error

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    console.log(jest.fn().mockReturnThis().status);
    await booksController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error retrieving books");
  });
});