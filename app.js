const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json').results

const port = 3000

// set view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// set static files
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList })
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