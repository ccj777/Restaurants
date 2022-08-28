// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model
const Restaurant = require("../../models/Restaurant")

// 定義首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id

  Restaurant.find({ userId })
    .lean()
    .then(restaurantsData => {
      res.render('index', { restaurantsData })
    })
    .catch(error => console.log(error))
})

// 搜尋功能包含&排序功能
router.get('/search', (req, res) => {
  const userId = req.user._id
  const keywords = req.query.keywords
  const keyword = keywords.trim().toLowerCase()
  const sort = req.query.sort
  let sortMode = {}

  // 用於控制index.hbs的下拉選單中<option>之selected屬性
  let optionSelected = {
    asc: false,
    desc: false,
    category: false,
    location: false,
  }

  // 不同排序方式設定
  switch (sort) {
    case 'asc':
      sortMode = { name: "asc" }
      optionSelected.asc = true
      break
    case 'desc':
      sortMode = { name: "desc" }
      optionSelected.desc = true
      break
    case 'category':
      sortMode = { category: "asc" }
      optionSelected.category = true
      break
    case 'location':
      sortMode = { location: "asc" }
      optionSelected.location = true
      break
  }

  // 未輸入關鍵字時
  if (!keywords) {
    return Restaurant.find({ userId })
      .lean()
      .sort(sortMode)
      .then(restaurantsData => {
        res.render("index", { restaurantsData: restaurantsData, optionSelected })
      })
      .catch(error => console.log(error))
  }

  Restaurant.find({ userId })
    .lean()
    .sort(sortMode)
    .then(restaurantsData => {
      const filteredRestaurantsData = restaurantsData.filter(data => data.name.toLowerCase().includes(keyword))
      res.render("index", { restaurantsData: filteredRestaurantsData, keywords, optionSelected })
    })
    .catch(error => console.log(error))
})




// 匯出路由模組
module.exports = router