const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/v1/user.route')
const app = express();
const bodyParser = require('body-parser');


// middleWare
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));


// MONGOOSE STRUCTURE
// SCHEMA -> MODEL-> QUERY



// Test route

app.get('/', (req, res) => {
    res.send("Task management system backend server is running")
})





// Data Routes
app.use("/api/v1/user", userRoute)





// Unknown API Handle

app.get('*', (req, res) => {

    res.send("Router isn't found!");
})


module.exports = app;










































