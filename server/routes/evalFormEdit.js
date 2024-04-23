const express = require('express')
const router = express.Router()

const {
    createForm,
    editForm,
    getFormData
 } = require('../controllers/evalFormEdit')

router.route('/createForm').post(createForm)
router.route('/editForm').patch(editForm)
router.route('/getForm').get(getFormData)

module.exports = router