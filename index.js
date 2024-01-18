const express = require('express')
const app = express();
const MongoDbDataBase = require('./db')
const port = 7000
MongoDbDataBase();

// thid MiddleWare is using for the send the json data in the data base
app.use(express.json());
app.use('/api/auth', require('./routers/auth'));
app.use('/api/notes', require('./routers/notes'));


app.listen(port, ()=>{
    console.log(`express application is listening on port number ${port}`);
})