const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const options = {
    swaggerDefinition: {
        openapi: '3.0.3',
        info: {
            title: 'Video Streaming API',
            version: '1.0.0',
            description: 'API for streaming videos'
        },
        
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server'
            }
        ]
    },
    apis: ['./routes/*.js']
};


module.exports = {
    DB: process.env.MONGO_DB,
    PORT: process.env.PORT,
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET,
        jwtOptions: {
            expiresIn: '24h',
            algorithm: 'HS256'
        }
    },
    options
}