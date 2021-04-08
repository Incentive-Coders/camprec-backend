const mongoose = require('mongoose');

let JobSchemas = mongoose.Schema({
    job_title : {
        type : String
    },
    location : {
        type : String
    },
    job_description : {
        type : String
    },
    college : [{
        type : mongoose.Schema.ObjectId
    }],
    student : [{
        type : mongoose.Schema.ObjectId
    }],
});

module.exports = JobSchemas = mongoose.model('jobs',JobSchemas);