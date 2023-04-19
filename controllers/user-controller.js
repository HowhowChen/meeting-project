const { getUser } = require('../helpers/auth-helpers')

const userController = {
  loginPage: async (req, res) => {
    res.render('login')
  },
  login: (req, res) => {
    const { group } = getUser(req)
    switch (group) {
      case '5th':
        res.redirect('/meetings/5th')
        break
      case '6th':
        res.redirect('/meetings/6th')
        break
      default:
        res.redirect('/meetings/5th')
    }
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logout Success!')
    req.logout()
    res.redirect('/users/login')
  }
}

module.exports = userController
