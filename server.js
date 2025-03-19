import express from "express"
import { v4 } from "uuid"

const app = express()
app.use(express.json()) // Middleware to parse JSON body from requests

const PORT = 8080; // PORT for starting server

const books = [] // In-memory array to store books

// Function to validate that a book has all required fields
const isValidBook = (book) => {
    return (
        book &&
        book.title &&
        book.author &&
        book.year
    )
}

// GET all books
app.get("/books", (req, res) => {
    try {
        res.status(200).send(books)
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

// POST a new book
app.post("/book", (req, res) => {
    try {
        const book = req.body

        // Validate book data
        if (!isValidBook(book)) return res.status(400).send("All fields are required")

        // Create new book with UUID
        const newBook = {
            id: v4(),
            title: book.title,
            author: book.author,
            year: book.year
        }

        books.push(newBook) // Add to array

        res.status(201).send(newBook) // Respond with created book
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

// GET a specific book by ID
app.get("/book/:id", (req, res) => {
    try {
        const { id } = req.params

        const book = books.find(book => book.id === id)

        if (!book) return res.status(404).send("Book not found")

        res.send(book)
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

// DELETE a book by ID
app.delete("/deleteBook/:id", (req, res) => {
    try {
        const { id } = req.params

        const index = books.findIndex(book => book.id === id)

        if (index < 0) return res.status(404).send("Book not found")

        books.splice(index, 1) // Remove book from array

        res.send("Book successfully deleted")
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.put("/book/:id", (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = req.body;

        const index = books.findIndex(book => book.id === id);

        if (index < 0) {
            return res.status(404).send("Book not found");
        }

        // Validate updated data
        if (!updatedBook.title || !updatedBook.author || !updatedBook.year) {
            return res.status(400).send("All fields are required");
        }

        // Update the book
        books[index] = {
            ...books[index],
            title: updatedBook.title,
            author: updatedBook.author,
            year: updatedBook.year
        };

        res.send("Book updated successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});
