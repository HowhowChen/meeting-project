const express = require('express')
const router = express.Router()

router.get('/users/login', (req, res) => {
  res.render('login')
})

router.post('/users/login', (req, res, next) => {
  const { account, password } = req.body
  console.log(account, password)
})

module.exports = router
