const express_ = require('express');
const app = express_();
const connectToDatabases = require('./config/connectToDatabase');

connectToDatabases();

app.use(express_.json({ extended: false }));

app.use("/api/student", require('./routes/student.js'));

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`the server is running on the port: ${PORT}`)
);