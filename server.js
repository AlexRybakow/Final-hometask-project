const express = require('express')
const app = express()
const api = require('./base/routes/api')
const path = require('path')
const mongoose = require('mongoose')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app')))
app.use(express.static(path.join(__dirname, 'node_modules')))

mongoose.connect('mongodb://localhost/27017', { useNewUrlParser: true })

app.use('/', api)


app.listen(3000, function () {
    console.log('Running on port 3000...')
})

