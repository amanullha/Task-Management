const mongoose = require('mongoose')
const _ = require('underscore')

// 1. Schema Design 

const UserSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        // Email validation regex pattern
        match: [/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/, 'Please enter a valid email address']
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'user'] // User type can only be 'admin' or 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Password must be at least 6 characters long
        maxlength: 100 // Password can be at most 100 characters long
    }



    // status: {
    //     type: String,
    //     default: 'Available',
    //     enum: {
    //         values: ['Available', 'Booked'],
    //         message: "Set the status"
    //     }
    // },
    // image: {
    //     type: String,
    //     required: true,
    // },


}, { timestamps: true })


// Mongoose middleware 

UserSchema.pre('save', function (next) {

    console.log("before saving data");

    next();

})

UserSchema.post('save', function (doc, next) {

    console.log("After saving data");

    next();
})


// Mongoose Instance Methods

UserSchema.methods.logger = function () {

    console.log(`Data saved for ${this.name} . from logger(Mongoose instance methods)`);
}



// Model 


const User = mongoose.model('User', UserSchema);

module.exports = User;
















