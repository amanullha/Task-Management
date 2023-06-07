const mongoose = require('mongoose');






// mongodb database connection

const DBConnect = async () => {

    // const connect = await mongoose.connect(`mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@cluster0.usf6bdf.mongodb.net/?retryWrites=true&w=majority`)
    //     .then(() => {
    //         console.log("Database connection successfully!!".yellow.bold);
    //     })
    //     .catch(() => {
    //         console.log("Database connection Error!!".red.bold);
    //     })
    const connect = await mongoose.connect(`mongodb+srv://task-management-user:xRKW7YZrIeCiO1P9@cluster0.0fuk0.mongodb.net/`)
        .then(() => {
            console.log("Database connection successfully!!".yellow.bold);
        })
        .catch(() => {
            console.log("Database connection Error!!".red.bold);
        })

    return connect;
}



module.exports = DBConnect;





























