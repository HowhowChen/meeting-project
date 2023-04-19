if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const exphbs = require('express-handlebars')
const express = require('express')

const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

require('./database/models')

// template engine: express-handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// static file
app.use(express.static('public'))

// middleware: routes
app.use(routes)

app.listen(PORT, () => console.log(`The app is listening ${PORT}`))
