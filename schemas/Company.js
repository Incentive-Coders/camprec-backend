const mongoose = require('mongoose');

let CompanySchemas = mongoose.Schema({
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
    about:{
        type : String,
    },
    year_of_established : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    website : {
        type : String
    },
    social_media : {
        twitter : {
            type : String
        },
        facebook : {
            type : String
        },
        linkedin : {
            type : String
        },
        instagram : {
            type : String
        }
    },
    vedio_link : {
        type : String
    },
    premium:{
        type : Boolean,
        required : true
    }
});

module.exports = CompanySchemas = mongoose.model('company',CompanySchemas);