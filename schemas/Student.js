const mongoose = require('mongoose');

let StudentSchemas = mongoose.Schema({
    email: {
        type : String,
        required : true 
    },
    password:{
        type : String,
        required : true
    },
    name:{
        type : String,
        required : true
    },
    college:{
        type : String,
        required : true
    },
    cgpa:{
        type : String,
        required : true
    },
    about:{
        type : String,
    },
    premium:{
        type : Boolean,
        required : true
    }
});

module.exports = StudentSchemas = mongoose.model('student',StudentSchemas);