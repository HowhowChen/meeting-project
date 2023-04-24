const { User, Category, Platform, Country } = require('../database/models')
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
    res.render('admin/user-new')
  },
  postUser: async (req, res, next) => {
    try {
      const { name, account, organization, group, role } = req.body
      const checkAccount = await User.findOne({ where: { account } })
      if (checkAccount) throw new Error('Account alreay exists!')

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

      res.render('admin/user-edit', { user })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name, account, organization, group, role } = req.body
      //  check account and user
      const [checkAccount, user] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findByPk(id)
      ])
      if (checkAccount) throw new Error('Account alreay exists!')
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
        password: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, bcrypt.genSaltSync(10))
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
  },
  getCategories: async (req, res, next) => {
    try {
      const [categories, category] = await Promise.all([
        Category.findAll({
          raw: true,
          order: [['id', 'ASC']]
        }),
        req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
      ])

      res.render('admin/meeting-category', { categories, category })
    } catch (err) {
      next(err)
    }
  },
  postCategory: async (req, res, next) => {
    try {
      const { name } = req.body

      await Category.create({ name })
      req.flash('success_messages', 'Success Create!')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  putCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const category = await Category.findByPk(id)
      if (!category) throw new Error("Category didn't exists!")

      await category.update({ name })
      req.flash('success_messages', 'Success Update!')
      res.redirect('/admin/categories')
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    const { id } = req.params
    const category = await Category.findByPk(id)
    if (!category) throw new Error("Category didn't exists!")

    await category.destroy()
    req.flash('success_messages', 'Success Delete!')
    res.redirect('/admin/categories')
  },
  getPlatforms: async (req, res, next) => {
    try {
      const [platforms, platform] = await Promise.all([
        Platform.findAll({
          raw: true,
          order: [['id', 'ASC']]
        }),
        req.params.id ? Platform.findByPk(req.params.id, { raw: true }) : null
      ])

      res.render('admin/meeting-platform', { platforms, platform })
    } catch (err) {
      next(err)
    }
  },
  postPlatform: async (req, res, next) => {
    try {
      const { name } = req.body

      await Platform.create({ name })
      req.flash('success_messages', 'Success Create!')
      res.redirect('/admin/platforms')
    } catch (err) {
      next(err)
    }
  },
  putPlatform: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const platfrom = await Platform.findByPk(id)
      if (!platfrom) throw new Error("Platform didn't exists!")

      await platfrom.update({ name })
      req.flash('success_messages', 'Success Update!')
      res.redirect('/admin/platforms')
    } catch (err) {
      next(err)
    }
  },
  deletePlatform: async (req, res, next) => {
    try {
      const { id } = req.params
      const platform = await Platform.findByPk(id)
      if (!platform) throw new Error("Platform didn't exists!")

      await platform.destroy()
      req.flash('success_messages', 'Success Delete!')
      res.redirect('/admin/platforms')
    } catch (err) {
      next(err)
    }
  },
  getCountries: async (req, res, next) => {
    try {
      const [countries, country] = await Promise.all([
        Country.findAll({
          raw: true,
          order: [['id', 'ASC']]
        }),
        req.params.id ? Country.findByPk(req.params.id, { raw: true }) : null
      ])

      res.render('admin/meeting-country', { countries, country })
    } catch (err) {
      next(err)
    }
  },
  postCountry: async (req, res, next) => {
    try {
      const { name } = req.body

      await Country.create({ name })
      req.flash('success_messages', 'Success Create!')
      res.redirect('/admin/countries')
    } catch (err) {
      next(err)
    }
  },
  putCountry: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const country = await Country.findByPk(id)
      if (!country) throw new Error("Country didn't exists!")

      await country.update({ name })
      req.flash('success_messages', 'Success Update!')
      res.redirect('/admin/countries')
    } catch (err) {
      next(err)
    }
  },
  deleteCountry: async (req, res, next) => {
    try {
      const { id } = req.params
      const country = await Country.findByPk(id)
      if (!country) throw new Error("Country didn't exists!")

      await country.destroy()
      req.flash('success_messages', 'Success Delete!')
      res.redirect('/admin/countries')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
