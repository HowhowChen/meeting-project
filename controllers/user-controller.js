const { getUser } = require('../helpers/auth-helper')

const userController = {
  loginPage: async (req, res) => {
    res.render('login')
  },
  login: (req, res) => {
    const { group } = getUser(req)
    switch (group) {
      case '5th':
        res.json({ message: '5th' })
        break
      case '6th':
        res.json({ message: '6th' })
        break
      default:
        res.json({ message: '5th' })
    }
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/users/login')
  }
}

module.exports = userController
