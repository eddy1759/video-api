const mongoose = require('mongoose')
const { DB } = require('./config')


const databaseConnection = () => {
    mongoose.set('strictQuery', false)

    mongoose.connect(DB)

    mongoose.connection.on("connected", () => {
        console.info("Database connected successfully")
    })

    mongoose.connection.on("error", (error) => {
        console.info("An error occurred")
        console.error(error)
    })
}

module.exports = databaseConnection