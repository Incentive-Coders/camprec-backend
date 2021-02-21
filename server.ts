const express = require('express');
const app = express();
const connectToDatabases = require('./config/connectToDatabase');

connectToDatabases();

app.use(express.json({ extended: false }));

app.use("/api/users", require('./routes/users'));

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`the server is running on the port: ${PORT}`)
);