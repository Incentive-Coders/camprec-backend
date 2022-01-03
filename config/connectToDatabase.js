const mongoose = require('mongoose');
const config = require('config');
const dotenv= require('dotenv');

dotenv.config();

const connectToDatabase = async () => {
        await mongoose.connect(
            process.env.MONGO_URI, { useNewUrlParser: true }).then(()=> {
                console.log("MongoDB is connected");
            }).catch((err) =>{
                console.log(err);
            } )
        

}

module.exports = connectToDatabase;