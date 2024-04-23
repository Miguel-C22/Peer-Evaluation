const mongoose = require("mongoose")

const EvaluationData = new mongoose.Schema({
    reviewerName: {
        type: String,
    },
    subjectName: {
        type: String, 
    },
    questions: [
        {
            id: String, // When The form is edited each question will have its own ID and that Id will go here
            question: String,   
        }
    ],
    grade: [
        {
            questionId: String, // When The form is edited each question will have its own ID and that Id will go here
            grade: Number,   
        }
    ],
    comments: {
        type: String
    }
});

// Middleware to automatically convert line breaks
EvaluationData.pre('save', function(next) {
    // Convert line breaks to \n characters
    if (this.comments) {
        this.comments = this.comments.replace(/\r?\n/g, '\\n');
    }
    next();
});


const EvalData = mongoose.model('EvalData', EvaluationData);

module.exports = EvalData;

//comment: String