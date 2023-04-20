const { User } = require('../database/models')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true,
        order: [['id', 'ASC']]
      })
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        raw: true
      })

      res.render('admin/userEdit', { user })
    } catch (err) {
      next(err)
    }
  },
  patchUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exists!")
      await user.update({
        password: process.env.DEFAULT_PASSWORD
      })
      req.flash('success_messages', 'password already reset!')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
