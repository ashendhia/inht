const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const candidatureRouter = require('./controllers/candidature')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to xampp database')



app.use(cors())

app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/candidature', candidatureRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app