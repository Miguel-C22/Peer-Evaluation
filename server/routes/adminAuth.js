const express = require('express')
const router = express.Router()

const {
    login, 
    register,
    getSingleUser,
    updatePassword,
    getallUsers
} = require('../controllers/adminAuth')

router.post('/register', register)
router.post('/login', login)
router.get('/getSingleUser/:userId', getSingleUser)
router.patch('/updatePassword/:userId', updatePassword)
router.get('/getallUsers', getallUsers)

module.exports = router 
