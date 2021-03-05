const express_ = require('express');
const app = express_();
const connectToDatabases = require('./config/connectToDatabase');
const rateLimit = require("express-rate-limit");
const xss  = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

connectToDatabases();

const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 500,
    message:
    "Too many accounts created from this IP, please try again after an hour"
});

app.use(apiLimiter);//safety against DOS attack

app.use(xss());//safety against XSS attack or Cross Site Scripting attacks

app.use(helmet());//safety against XSS attack

app.use(mongoSanitize());//safety against NoSql Injections

app.use(express_.json({ extended: false }));

app.use("/api/student", require('./routes/student'));

app.use("/api/company", require('./routes/company'));

app.use("/api/college", require('./routes/college'));

app.use("/api/jobs", require('./routes/jobs'));

let PORT = process.env.PORT || 3000;

var server = https.createServer(options, app);

server.listen(PORT, () => {
    console.log("server starting on port : " + PORT)
});
