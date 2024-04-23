const express = require('express')
const router = express.Router()

const {
    login, 
    register,
    getallUsers,
    getSingleUser,
    updatePassword,
    removeAllAuth
} = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/getallUsers', getallUsers)
router.get('/getSingleUser/:userId', getSingleUser)
router.patch('/updatePassword/:userId', updatePassword)
router.delete('/removeAllAuth',  removeAllAuth)

module.exports = router 

