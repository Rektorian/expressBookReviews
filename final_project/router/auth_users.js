const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log("inside /login");
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("Inside /auth/review/:isbn");
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let filtered_book = books[isbn]; // Retrieve book object associated with isbn

  if(filtered_book) {
    let review_to_be_added = req.query.review;
    if (review_to_be_added) {
      filtered_book.reviews[username] = review_to_be_added; // creates a new property in the reviews object with the username as the key and the review_to_be_added as the value
      books[isbn] = filtered_book; // updates the books array with the filtered_book object
    }
    res.send(`Review for book with isbn: ${isbn} added/updated!`)
  } else {
    res.send(`Unable to find book for provided isbn: ${isbn}.`);
  }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("Inside delete /auth/review/:isbn");
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  console.log(`username is ${username}`);
  let filtered_book = books[isbn]; // Retrieve book object associated with isbn
  console.log(books[isbn].reviews[username])

  if(filtered_book) {
    delete books[isbn].reviews[username]
    res.send(`Review for book with isbn: ${isbn} deleted!`)
  } else {
    res.send(`Unable to find book for provided isbn: ${isbn}.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
