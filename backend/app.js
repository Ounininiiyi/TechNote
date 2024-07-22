require('dotenv').config()
// can be used instead of asynchandler just input it here and it works for all 
// require('express-async-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const {logger} = require('./middlewares/logger')
const corsOptions = require('./config/corsOptions')
const errorHandler = require('./middlewares/errorHandler')
const connectDB = require('./config/dbConn')
const {logEvents} = require('./middlewares/logger')

const app = express()
const PORT = process.env.PORT || 4000

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRouter'))
app.use('/users', require('./routes/userRouter'))
app.use('/notes', require('./routes/noteRouter'))

app.all('*', (req, res) => {
	res.status(404)
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'))
	} else if (req.accepts('json')) {
		res.json({message: '404 Not Found'})
	} else {
		res.type('txt').send('404 Not Found')
	}
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB')
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})	
})

mongoose.connection.on('error', err => {
	console.error(err)
	logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})