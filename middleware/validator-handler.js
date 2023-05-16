const { body, validationResult } = require('express-validator')
const { getUser } = require('../helpers/auth-helpers')

const userValidations = [
  body('name').trim().not().isEmpty().withMessage("User can't empty"),
  body('account').trim().not().isEmpty().withMessage("Account can't empty"),
  body('organization').trim().not().isEmpty().withMessage("Organization can't empty"),
  body('group').trim().not().isEmpty().withMessage("Group can't empty"),
  body('role').trim().not().isEmpty().withMessage("Role can't empty")
]

const userPasswordValidations = [
  body('password').trim().not().isEmpty().withMessage('密碼不可空白').bail().isLength({ min: 5 }).withMessage('密碼大於5位'),
  body('passwordCheck').trim().not().isEmpty().withMessage('確認密碼不可空白').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true //  沒問題務必回傳true!!
    })
]

module.exports = {
  addUserValidator: async (req, res, next) => {
    const { name, account, organization, group, role } = req.body
    //  平行執行註冊驗證
    await Promise.all(userValidations.map(userValidation => (
      userValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/user-new', {
        errors: errors.array(),
        name,
        account,
        organization,
        group,
        role
      })
    }

    next()
  },
  editUserValidator: async (req, res, next) => {
    const user = req.body

    //  平行執行註冊驗證
    await Promise.all(userValidations.map(userValidation => (
      userValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/user-edit', {
        errors: errors.array(),
        user
      })
    }

    next()
  },
  putUserValidator: async (req, res, next) => {
    const user = getUser(req)
    delete user.password

    //  平行執行註冊驗證
    await Promise.all(userPasswordValidations.map(userPasswordValidation => (
      userPasswordValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('users/edit', {
        errors: errors.array(),
        user
      })
    }

    next()
  }
}
