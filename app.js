const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results
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

//set mongoose
mongoose.connect(process.env.MONGODB_URI_2, { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', error => {
  console.log(error)
})

db.once('open', () => {
  console.log('mongodb connected.')
})

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      res.render('index', { restaurantsData })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.find(restaurant => restaurant.id === Number(req.params.id))
  res.render('show', { restaurant })
})

// 搜尋功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.filter(restaurant => { return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) })
  res.render('index', { restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})