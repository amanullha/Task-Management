const mongoose = require('mongoose')
const _ = require('underscore');
const { TaskStatus } = require('../enums/taskStatus.enum');

// 1. Schema Design 

const TaskSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.InProgress,
    },
    assignedCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


// Mongoose middleware 

TaskSchema.pre('save', function (next) {

    console.log("before saving data");

    next();

})

TaskSchema.post('save', function (doc, next) {

    console.log("After saving data");

    next();
})


// Mongoose Instance Methods

TaskSchema.methods.logger = function () {

    console.log(`Data saved for ${this.name} . from logger(Mongoose instance methods)`);
}



// Model 


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
















