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
        type : String
    },
    date_of_birth:{
        type : String
    },
    experience : [{
        names : {
           type : String
        },
        description : {
            type : String
        },
        companys : {
            type : String
        },
        duration : {
            type : String
        },
        link : {
            type : String
        }
    }],
    education : [{
        course : {
            type : String
        },
        institute : {
            type : String
        },
        marks : {
            type : String
        }
    }],
    certification : [{
        courses : {
            type : String
        },
        institutes : {
            type : String
        },
        valid_till : {
            type : Date
        },
        links : {
            type : String 
        }
    }],
    skills : [{
        type : String
    }],
    resume : {
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
        },
        github : {
            type : String
        }
    },
    contactno : {
        type : String
    },
    premium:{
        type : Boolean,
        required : true
    }
});

module.exports = StudentSchemas = mongoose.model('student',StudentSchemas);