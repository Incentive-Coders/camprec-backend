const express_ = require('express');
const app = express_();
const connectToDatabases = require('./config/connectToDatabase');

connectToDatabases();

app.use(express_.json({ extended: false }));

app.use("/api/student", require('./routes/student'));

app.use("/api/company", require('./routes/company'));

app.use("/api/college", require('./routes/college'));

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
    console.log(`the server is running on the port: ${PORT}`)
);