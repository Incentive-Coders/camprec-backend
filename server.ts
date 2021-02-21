const express = require('express');
const app = express();
const connectToDatabases = require('./config/connectToDatabase.ts');

connectToDatabases();

app.use(express.json({ extended: false }));

app.use("/api/student", require('./routes/student'));

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`the server is running on the port: ${PORT}`)
);