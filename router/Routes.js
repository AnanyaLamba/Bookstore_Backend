const mongodb = require('mongodb');
const express = require('express');

const router = express();

// const db = require('../connection')
// const collection = db.collection('books');

const mongoose = require('mongoose');
mongoose.connection

router.get("/", async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.query);

    try {
        const books  = await collection.find().toArray();
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch books from the database" });
    }
});

router.get("/:id", getObjectId, async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log("Fetching:", req.params.id);
    console.log(req.query);
    try {
        const book  = await collection.findOne({
            _id: req.objId,
        });
        res.json(book)
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch book from the database" });
    }
    });

router.post("/", async(req, res) => {
    console.log(req.method);
    console.log(req.body);
    
    const {  author, title } = req.body;
    const newBook = {  author, title };

    try {
        await collection.insertOne(newBook)
        res.json(newBook)
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "unable to open a file while writing on server" });
        return;
    }
});

router.patch("/:id", getObjectId, async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log("Editing:", req.params.id);
    console.log(req.body);

    const { author , title } = req.body;

    try {
        let result = await collection.findOneAndUpdate(
            {_id: req.objId},
            {
                $set: { 
                    author,
                    title
                }
            })
            res.json(result)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to modify book data" });
        return;
    }
});

router.delete("/:id", getObjectId, async(req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log("Deleting:", req.params.id);

    try {
        const book = await collection.findOneAndDelete(
            {_id: req.objId}
        )
        res.json(book)
    } catch (error) {
        
    }
});

  function getObjectId(req, res, next){
    const objId = new mongodb.ObjectId(req.params.id)
    req.objId = objId;
    next();
  }


module.exports = router