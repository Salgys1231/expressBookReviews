const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.get('/', async (req, res) => {
    try {
      // Simulating an async fetch operation (you could also point to an API)
      const getBooks = () => {
        return new Promise((resolve) => {
          resolve(books); // books is from booksdb.js
        });
      };
  
      const bookList = await getBooks();
  
      res.status(200).json(bookList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books." });
    }
  });
public_users.post("/register", (req,res) => {
  const { username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4)); 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;

  // Simulated async function (using Promise)
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve({ data: books[isbn] }); // mimic Axios-style response
      } else {
        reject(new Error("Book not found"));
      }
    });
  };

  try {
    const response = await getBookByISBN(isbn);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const requestedAuthor = req.params.author.toLowerCase();
  
    // Simulate async fetch
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        for (let key in books) {
          const book = books[key];
          if (book.author.toLowerCase() === author) {
            matchingBooks.push(book);
          }
        }
  
        if (matchingBooks.length > 0) {
          resolve({ data: matchingBooks });
        } else {
          reject(new Error("Author not found"));
        }
      });
    };
  
    try {
      const response = await getBooksByAuthor(requestedAuthor);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();
  
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchingBooks = [];
  
        for (let key in books) {
          const book = books[key];
          if (book.title.toLowerCase() === title) {
            matchingBooks.push(book);
          }
        }
  
        if (matchingBooks.length > 0) {
          resolve({ data: matchingBooks });
        } else {
          reject(new Error("Title not found"));
        }
      });
    };
  
    try {
      const response = await getBooksByTitle(requestedTitle);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
     return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
