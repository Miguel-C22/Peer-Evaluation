const EvaluationData = require("../schema/evalData")

const submitEvaluation = async (req, res) => {
    const { 
        reviewerName,
        subjectName,
        questions,
        grade,
        comments
    } = req.body

    try {
        const evalData = await EvaluationData.create({ 
        reviewerName,
        subjectName,
        questions,
        grade,
        comments // Update to match the schema
    })
    // { comment: comments }

    if (!evalData) {
        return res.status(400).json({ msg: "Failed to Submit Evaluation" });
      }

    res.status(200).json({evalData})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  
}

const allEvaluationData = async (req, res) => {
    try {
      const getAllEvalData = await EvaluationData.find({})
      res.status(200).json({getAllEvalData})
    } catch (error) {
      console.log(error)
      res.status(400).json({msg: "Failed getting all EvalData"})
    }

}


// This is getting all Eval forms there team mates filled out
const getStudentEvaluationData = async (req, res) => {
    const { studentName } = req.params

    try {

        const studentEvalData = await EvaluationData.find({subjectName: studentName}).exec()
        res.status(200).json({studentEvalData})

        if(!studentEvalData){
            return res.status(400).json({ msg: "Failed to getting students eval forms" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    
}

const removeAllEvalData = async (req, res) => {
    try {
      const removeTeams = await EvaluationData.deleteMany({})
      res.json({ success: "Removed all Eval Data" })
    } catch (error) {
      console.error('Error deleting documents:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


module.exports = { 
    submitEvaluation,
    getStudentEvaluationData,
    removeAllEvalData,
    allEvaluationData
}