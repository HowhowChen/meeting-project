const { getUser } = require('../helpers/auth-helpers')
const { User } = require('../database/models')
const bcrypt = require('bcryptjs')

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
  logout: (req, res, next) => {
    req.logout(err => {
      if (err) return next(err)
      req.flash('success_messages', 'Logout Success!')
      res.redirect('/users/login')
    })
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })
      if (!user) throw new Error("User doesn't exist.")
      res.render('users/edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { password } = req.body
      const user = await User.findByPk(id)
      if (!user) throw new Error("User doesn't exist.")

      await user.update({
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      req.flash('success_messages', 'The password is setted findished')
      res.redirect(`/users/${id}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
