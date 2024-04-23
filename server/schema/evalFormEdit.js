const mongoose = require("mongoose")

const EvaluationForm = new mongoose.Schema({
    attributes: [
        {
            question: String,
        }
    ],
    grades: [
        {
            performanceLevel: String,
            grade: Number
        }
    ]

});

const EvalForm = mongoose.model('EvaluationForm', EvaluationForm);

module.exports = EvalForm;
