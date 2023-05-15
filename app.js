if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const exphbs = require('express-handlebars')
const express = require('express')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const redisStore = require('./database/redis/config')
const passport = require('./config/passport')

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const routes = require('./routes')
const { getUser } = require('./helpers/auth-helpers')

const app = express()
const PORT = process.env.PORT || 3000

require('./database/models')

// template engine: express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

// middleware: staic files, body-parser, json
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//  middleware: session
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRECT,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 10 // session max age in milliseconds
    }
  })
)

// passport intialize, startup session
app.use(passport.initialize())
app.use(passport.session())

//  middleware:flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = getUser(req)
  next()
})

//  middleware: method-override
app.use(methodOverride('_method'))

// middleware: routes
app.use(routes)

app.listen(PORT, () => console.log(`The app is listening ${PORT}`))
