const express = require('express')
const databaseConnection = require('./config/dbConfig')
const { PORT, options } = require('./config/config')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')



const app = express()
databaseConnection()
const specs = swaggerJsdoc(options)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to our Video Streaming API</h1>")
})

app.listen(PORT, () => {
    console.info(`Server Listening to port: ${PORT}`)
})



