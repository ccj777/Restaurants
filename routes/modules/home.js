// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model
const Restaurant = require("../../models/Restaurant")

// 定義首頁路由
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      res.render('index', { restaurantsData })
    })
    .catch(error => console.log(error))
})

// 搜尋功能
router.get('/search', (req, res) => {
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

// 匯出路由模組
module.exports = router