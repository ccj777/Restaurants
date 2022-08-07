const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const routes = require('./routes')

const mongoose = require('mongoose')
const db = mongoose.connection
const port = 3000

//models
const Restaurant = require("./models/Restaurant")

// set view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(routes)

//set mongoose
mongoose.connect(process.env.MONGODB_URI_2, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', error => {
  console.log(error)
})

db.once('open', () => {
  console.log('mongodb connected.')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})