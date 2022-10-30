const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser : true })
const db = mongoose.connection
db.on('error', error=>{console.error(error)})
db.once('open', ()=>{console.log('Conncected to MongoDB')})

const port = process.env.PORT

const postRouter = require('./routes/post_route.js')

app.use('/post', postRouter)

app.get('/', (req, res) => {
    res.send('Hello!!!')
})

app.listen(port, () => {
    console.log('Server started!')
})
