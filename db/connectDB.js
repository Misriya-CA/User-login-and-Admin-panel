const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017'

        );
        console.log('mongodb connected');
    }catch (error){
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;