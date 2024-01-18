const mongoose = require('mongoose')
const express = require('express');
const app = express();
const mongoURI = "mongodb://0.0.0.0:27017/newdatabase"
const MongoDbDataBase = ()=>{
    mongoose.connect(mongoURI)
    .then((success)=> app.listen())
    .catch((error)=> console.log(error.message))
    console.log('Mongo DB Database has been connected');
}
module.exports = MongoDbDataBase;

