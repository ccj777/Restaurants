const mongoose = require('mongoose')
const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json').results

mongoose.connect(process.env.MONGODB_URI_2, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', error => {
  console.log(error)
})

db.once('open', () => {
  console.log("mongoose connected")
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done.')
      db.close
    })
    .catch(error => {
      console.log(error)
    })
})
