const express = require('express')
const cors = require('cors')
const app = express()

const roteador = require('./rotas')
app.use(cors())
app.use(express.json())
app.use('/', roteador)


module.exports = app