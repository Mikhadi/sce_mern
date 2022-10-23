const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const port = process.env.PORT

const postRouter = require('./routes/post_route.js')

app.use('/post', postRouter)

app.get('/', (req, res) => {
    res.send('Hello!!!')
})

app.listen(port, () => {
    console.log('Server started!')
})
