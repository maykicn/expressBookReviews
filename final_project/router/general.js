const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required!"})
  }

  const userExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
  if(userExists){
    return res.status(409).json({message: "user is already exists!"})
  }

  users.push({username, password})
  return res.status(201).json({message: "user registered successfully", username: username})

});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an async call to fetch books
    const getBooks = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };
    
    const booksList = await getBooks();
    res.status(200).json(booksList);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = async (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if(book){
            resolve(book);
          }else{
            reject(new Error("Book not found"));
          }
        }, 1000);
      });
    }
    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book,null,2))
  } catch (error) {
    res.status(404).json({message: error.message})
  }
});
  
  // Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksOfAuthor = []
  Object.values(books).forEach(book => {
    if(book.author == author){
      booksOfAuthor.push(book)
    }
  });
  if (booksOfAuthor.length > 0){
    res.status(200).send(JSON.stringify(booksOfAuthor, null, 2));
  }else{
    res.status(404).json({message: "Book not found belongs author"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let booksOfTitle = []
  Object.values(books).forEach(book=>{
    if(book.title == title){
      booksOfTitle.push(book)
    }
  })
  if(booksOfTitle.length >0){
    res.status(200).send(JSON.stringify(booksOfTitle, null, 2))
  }else{
    res.status(404).json({message : "Book not found with the title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 2))
  }else{
    res.status(404).json({message: "Book not found"})
  }
});

module.exports.general = public_users;
