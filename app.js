if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const exphbs = require('express-handlebars')
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const routes = require('./routes')
const { getUser } = require('./helpers/auth-helper')

const app = express()
const PORT = process.env.PORT || 3000

require('./database/models')

// template engine: express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// middleware: staic files, body-parser, json
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//  設定session
app.use(session({
  secret: process.env.SESSION_SECRECT,
  resave: false,
  saveUninitialized: false
}))

// 設定Passport初始化, 啟用session功能
app.use(passport.initialize())
app.use(passport.session())

//  使用flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

// middleware: routes
app.use(routes)

app.listen(PORT, () => console.log(`The app is listening ${PORT}`))
