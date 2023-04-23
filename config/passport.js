const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User } = require('../database/models')

//  set up Passport Strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true
  },
  //  authenticate user
  async (req, account, password, callback) => {
    //  account or password error
    const user = await User.findOne({ where: { account } })
    if (!user) return callback(null, false, req.flash('error_messages', 'account or password error!'))
    // password can not match
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return callback(null, false, req.flash('error_messages', 'account or password error!'))
    // no error
    callback(null, user)
  }
))

// serialize and deserialize user
passport.serializeUser((user, callback) => {
  callback(null, user.id)
})

passport.deserializeUser(async (id, callback) => {
  const user = await User.findByPk(id)
  return callback(null, user.toJSON())
})

module.exports = passport
