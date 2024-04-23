require('dotenv').config()
const fileUpload = require('express-fileupload');
const express = require('express')
const app = express()

const cors = require('cors');
// Use CORS middleware
app.use(cors());

app.use(express.json())
app.use(fileUpload());
// connect MongoDB
const connectDB = require('./db/connect')

//routers
const authRouter = require('./routes/auth')
const teamRouter = require('./routes/teams')
const evalData = require('./routes/evalData')
const adminAuth = require('./routes/adminAuth')
const evalFormEdit = require('./routes/evalFormEdit')


//routes
app.use(express.static('public'));
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/adminAuth', adminAuth)
app.use('/api/v1/teams', teamRouter)
app.use('/api/v1/evalData', evalData)
app.use('/api/v1/evalFormEdit', evalFormEdit)

const port = process.env.PORT || 3005;

const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start() 