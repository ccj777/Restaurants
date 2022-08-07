const Restaurant = require('../Restaurant')
const restaurantList = require('../../restaurant.json').results
const db = require("../../config/mongoose")

db.once('open', () => {
  console.log("run seeder script")
  Restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done.')
      db.close
    })
    .catch(error => {
      console.log(error)
    })
})
