const express = require('express')
const User = require('../../models/user')
const router = express.Router()
const passport = require('passport')

// login頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// login POST
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
}))

// register頁面
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  // 取得表單參數
  const { name, email, password, conformPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        // 如果已有使用者，退回註冊畫面
        console.log('The email have been used.')
        res.render('register', {
          name,
          email,
          password,
          conformPassword
        })
      } else {
        // 如果沒有，寫入資料
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch(error => console.log(error))
      }
    })
})

// logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router