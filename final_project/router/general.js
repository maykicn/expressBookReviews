const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]
  if (book){
    res.send(JSON.stringify(book,null,2))
  }else{
    res.status(404).json({message: "Book not found"})
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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
