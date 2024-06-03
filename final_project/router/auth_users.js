const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username ===username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body

  if(!username || !password){
    res.status(400).json({message: "username and password are required"})
  }
  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign({ username }, "secretKey");
    req.session.authorization = { accessToken };
    console.log("accessToken: ",accessToken)
    return res.status(200).json({ message: "Login successful", accessToken });
  }else{
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.user;

  if(!isbn || !review){
    return res.status(400).json({message: "ISBN and review are required"})
  }

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"})
  }

  const book = books[isbn];

  book.reviews[username] = review;
  const response = { message: "Review added successfully", reviews: book.reviews[username] };
  return res.status(200).send(JSON.stringify(response, null, 2));

});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  if(!isbn){
    return res.status(400).json({message: "ISBN and review are required"})
  }

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"})
  }

  const book = books[isbn];

  // Check if the review by the user exists
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }


  delete book.reviews[username];
  const response = {  message: "Review deleted successfully", reviews: book.reviews[username]};
  return res.status(200).send(JSON.stringify(response, null, 2));

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
