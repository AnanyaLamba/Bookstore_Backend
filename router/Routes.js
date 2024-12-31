const mongodb = require("mongodb");
const express = require("express");

const router = express();

const db = require("../connection");
const Book = require("../models/books");
const {
  getAllBooks,
  createNewBook,
  updateBookByTitle,
  deleteBookByTitle,
  searchBooksByGenre
} = require("../controller/controller");

router.get("/", getAllBooks);

router.post("/", createNewBook);

router.put("/:title", updateBookByTitle);

router.delete("/:title", deleteBookByTitle);

router.get('/genre/:genre', searchBooksByGenre);

module.exports = router;
