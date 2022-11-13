// import express
const express = require('express')
require('dotenv').config()
require('./Database/connection')

const app = express()
const port = process.env.PORT || 8000

// middleware
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


// import route
const TestRoute = require('./route/testroute')
const CategoryRoute = require('./route/CategoryRoute')
const ProductRoute = require('./route/ProductRoute')
const UserRoute = require('./route/UserRoute')
const OrderRoute = require('./route/OrderRoute')

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api',TestRoute)
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)

app.use('/public/uploads',express.static('public/uploads'))


app.get('/hello', (request, response)=>{
    response.send("HELLO WORLD!!!")
})

app.listen(port, ()=>{
    console.log(`Server started successfully at port: ${port}`)
})