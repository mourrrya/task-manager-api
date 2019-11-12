const mongoose = require('mongoose')
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'
mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })


const connection=mongoose.connection;
connection.once("open",()=>{
    console.log("mongodb database connection established successfully")
})