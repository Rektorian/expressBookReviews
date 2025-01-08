// Import the axios library
const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  console.log("inside /register");
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }

  } else {
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// =============================================================>GET books list<=============================================================================

// // Get the book list available in the shop -> BASIC approach
// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop using async/await and Axios -> AXIOS approach 1
public_users.get('/', async function (req, res) {
  axios.get("http://localhost:5000/internal-books")
  // If the request is successful, the `.then` block is executed.
    .then(response => {
      // The response object contains the data returned from the server.
      res.send(JSON.stringify(response.data, null, 4));
    })
    // If there is an error during the request, the `.catch` block is executed.
    .catch(error => {
      // We log an error message to the console along with the error object.
      // This helps in debugging and understanding what went wrong with the request.
      console.error('Error fetching book list:', error);
      res.status(500).send('Error fetching book list');
    });
});

// // Get the book list available in the shop using async/await and Axios -> AXIOS approach 2
// public_users.get('/', async function (req, res) {
//   try {
//     const response = await axios.get("http://localhost:5000/internal-books");
//     res.send(JSON.stringify(response.data, null, 4));
//   } catch (error) {
//     console.error('Error fetching book list:', error);
//     res.status(500).send('Error fetching book list');
//   }
// });

// Separate route to serve the books data for axios.get() to simulate external call -> AXIOS approach
public_users.get('/internal-books', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// =============================================================>GET books list by ISBN<=============================================================================

// // Get book details based on ISBN -> BASIC approach
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn])
// });

// Get book details based on ISBN using async/await and Axios -> AXIOS approach
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/internal-isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching books list by ISBN', error);
    res.status(500).send('Error fetching books list by ISBN');
  }
});

// Separate route to serve the books data by ISBN for axios.get() to simulate external call -> AXIOS approach
public_users.get('/internal-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// =============================================================>GET books list by Author<=============================================================================

// // Get book details based on author -> BASIC approach
// // When using Postman, you can manually encode the spaces in the URL by replacing them with %20. 
// // For example, if you want to pass a title like "Super House", you should enter it in the URL as "Super%20House":
// // http://localhost:5000/title/Super%20House
// public_users.get('/author/:author', function (req, res) {
//   const author_to_find = req.params.author.toLowerCase();
//   console.log(`author_to_find is ${author_to_find}`);
//   let filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author_to_find);
//   console.log(filteredBooks);

//   res.send(filteredBooks);
// });

// Get book details based on author using async/await and Axios -> AXIOS approach
public_users.get('/author/:author', async function (req, res) {
  const author_to_find = req.params.author.toLowerCase();
  axios.get(`http://localhost:5000/internal-author/${author_to_find}`)
  // If the request is successful, the `.then` block is executed.
    .then(response => {
      // The response object contains the data returned from the server.
      res.send(response.data);
    })
    // If there is an error during the request, the `.catch` block is executed.
    .catch(error => {
      // We log an error message to the console along with the error object.
      // This helps in debugging and understanding what went wrong with the request.
      console.error('Error fetching books list based on author:', error);
      res.status(500).send('Error fetching books list based on author');
    });
});

// Separate route to serve book details based on author for axios.get() to simulate external call -> AXIOS approach
public_users.get('/internal-author/:author', function (req, res) {
  const author_to_find = req.params.author;
  let filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author_to_find);
  res.send(filteredBooks);
});

// =============================================================>GET books list by Title<=============================================================================

// // Get all books based on title -> BASIC approach
// public_users.get('/title/:title', function (req, res) {
//   const title_to_find = req.params.title.toLowerCase();
//   console.log(`title_to_find is ${title_to_find}`);
//   let filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title_to_find);

//   res.send(filteredBooks)
// });

// Get book details based on title using async/await and Axios -> AXIOS approach
public_users.get('/title/:title', async function (req, res) {
  const title_to_find = req.params.title.toLowerCase();
  axios.get(`http://localhost:5000/internal-title/${title_to_find}`)
  // If the request is successful, the `.then` block is executed.
    .then(response => {
      // The response object contains the data returned from the server.
      res.send(response.data);
    })
    // If there is an error during the request, the `.catch` block is executed.
    .catch(error => {
      // We log an error message to the console along with the error object.
      // This helps in debugging and understanding what went wrong with the request.
      console.error('Error fetching books list based on title:', error);
      res.status(500).send('Error fetching books list based on title');
    });
});

// Separate route to serve book details based on title for axios.get() to simulate external call -> AXIOS approach
public_users.get('/internal-title/:title', function (req, res) {
  const title_to_find = req.params.title;
  let filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title_to_find);
  res.send(filteredBooks);
});

// =============================================================>GET books review by ISBN<=============================================================================

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn.toLowerCase();
  console.log(`isbn_review_to_find is ${isbn}`);
  const reviews = books[isbn]["reviews"];

  res.send(reviews)
});

module.exports.general = public_users;
