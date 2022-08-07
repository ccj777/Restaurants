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
app.use(express.urlencoded({ extended: true }))

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

// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
app.post('/restaurants', (req, res) => {
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽指定餐聽頁面 
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(error => console.log(error))
})

// edit頁面
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => console.log(error))
})

//edit頁面POST
app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const keys = Object.keys(req.body)
  Restaurant.findById(id)
    .then(restaurantData => {
      for (let key of keys) {
        restaurantData[key] = req.body[key]
      }
      return restaurantData.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${id}`)
    })
    .catch(error => console.log(error))
})

// 刪除餐廳
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurantData => restaurantData.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 搜尋功能
app.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const keyword = keywords.trim().toLowerCase()

  if (!req.query.keywords) {
    res.redirect("/")
  }

  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      const filteredRestaurantsData = restaurantsData.filter(data =>
        data.name.toLowerCase().includes(keyword)
      )
      res.render("index", { restaurantsData: filteredRestaurantsData, keywords })
    })
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})