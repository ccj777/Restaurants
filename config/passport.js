const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // local strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'The email has not been registered.' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or password incorrect.' })
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

  // 序列化
  passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id)
  })
  // 反序列化
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })

}
