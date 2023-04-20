const { User } = require('../database/models')
const bcrypt = require('bcryptjs')

const adminController = {
  getUsers: async (_, res, next) => {
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
  getUserPage: async (_, res) => {
    res.render('admin/userNew')
  },
  postUser: async (req, res, next) => {
    try {
      const { name, account, organization, group, role } = req.body
      await User.create({
        name,
        account,
        password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10)),
        organization,
        group,
        role
      })

      res.redirect('/admin/users')
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
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, account, organization, group, role } = req.body
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exists!")

      await user.update({
        name,
        account,
        organization,
        group,
        role
      })
      req.flash('success_messages', `${name}'s profile is already edited!`)
      res.redirect('/admin/users')
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
  },
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) throw new Error("User didn't exists!")

      await user.destroy()
      req.flash('success_messages', 'Success Delete!')
      res.redirect('/admin/users')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
