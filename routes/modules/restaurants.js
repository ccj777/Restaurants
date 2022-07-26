// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引用 Todo model
const Restaurant = require("../../models/Restaurant")

// 定義路由
// 新增餐廳頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 新增餐廳
router.post('', (req, res) => {
  req.body.userId = req.user._id
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 瀏覽指定餐聽頁面 
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  
  return Restaurant.findOne({_id, userId})
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(error => console.log(error))
})

// edit頁面
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => console.log(error))
})

//edit
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const keys = Object.keys(req.body)
  Restaurant.findOne({ _id, userId })
    .then(restaurantData => {
      for (let key of keys) {
        restaurantData[key] = req.body[key]
      }
      return restaurantData.save()
    })
    .then(() => {
      res.redirect(`/restaurants/${_id}`)
    })
    .catch(error => console.log(error))
})

// 刪除餐廳
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Restaurant.findOne({ _id, userId })
    .then(restaurantData => restaurantData.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 匯出路由模組
module.exports = router