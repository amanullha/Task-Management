const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();



const app = require('./app');
const DBConnect = require('./utils/DBConnect');
const { errorHandler } = require('./utils/errorHandler');




// Database connection

DBConnect();









// server

const port = process.env.APP_PORT || 8080;

app.listen(port, () => {
    console.log(`Task management app is running on port: ${port}`.green.bold);
})

// Handle error
app.use(errorHandler);

// If errorHandler can't handle the errors
process.on("unhandledRejection", (error) => {
    console.log(error.name, error.message);
    app.close(() => process.exit(1))
})














































