const mongoose = require('mongoose');
const BookSchema = mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    author:{
        type:String,
        required: true,
    },
    publishedDate:{
        type:Date,
    },
    genre:{
        type:String,
    },
    price:{
        type:Number,
        validate:{
            validator: function (value){
                return value > 0
            },
            message: "Price must be positive number"
        },
    },

});

module.exports = mongoose.model('Book' , BookSchema);