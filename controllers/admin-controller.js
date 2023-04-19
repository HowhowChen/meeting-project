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
      console.log(id)
      res.render('admin/userEdit')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
