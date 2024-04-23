const express = require('express')
const router = express.Router()

const {
    submitEvaluation,
    getStudentEvaluationData,
    removeAllEvalData,
    allEvaluationData
 } = require('../controllers/evalData')

router.post('/submitEval', submitEvaluation)
router.get('/studentEvalData/:studentName', getStudentEvaluationData)
router.delete('/removeAllEvalData', removeAllEvalData)
router.get('/allEvaluationData', allEvaluationData)

module.exports = router