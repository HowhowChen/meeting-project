const { User } = require('../database/models')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true
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
  }
}

module.exports = adminController
