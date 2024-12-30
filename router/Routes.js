const mongodb = require('mongodb');
const express = require('express');

const router = express();

const db = require('../connection')
const collection = db.collection('books');
const Book = require("../models/books")



router.get("/", async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.query);

    try {
        const books  = await Book.find();
      
      const formattedBooks = books.map((book) => ({
        ...book._doc, 
        publishedDate: book.publishedDate
            ? new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
              }).format(book.publishedDate)
            : null, 
    }));

    console.log(formattedBooks);
    res.json(formattedBooks);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch books from the database" });
    }
});


router.post("/", async(req, res) => {
    console.log(req.method);
    console.log(req.body);
    
    

    try {
        const { title, author, publishedDate, genre, price } = req.body;

        const [day, month, year] = publishedDate.split("-");
        const formattedDate = new Date(`${year}-${month}-${day}`);

        const newBook = new Book({
            title,
            author,
            publishedDate: formattedDate,
            genre,
            price,
        });

        const response = await newBook.save();

        if (!response) {
            
            return res.status(500).json({ message: "Book not saved to the database" });
        }

        res.json({ message: "Book added to the database", data: response });
        // res.json(req.body)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "unable to open a file while writing on server" });
        return;
    }
});

router.put("/:title", async (req, res) => {
    try {
        const { title } = req.params; 
        const updatedDetails = req.body; 

        
        const updatedBook = await Book.findOneAndUpdate(
            { title: title }, 
            { $set: updatedDetails }, 
            { new: true }
        );

        
        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found with the specified title" });
        }

        
        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update the book" });
    }
});



router.delete("/:title", async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log("Deleting:", req.params.title);

    try {
        const {title} = req.params;
        const deletedBook = await Book.findOneAndDelete(
            {title:title}
        )
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found with the specified title" });
        }
        res.json({
            message: "Book successfully deleted",
            deletedBook: deletedBook,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete the book" });
    }
});




module.exports = router