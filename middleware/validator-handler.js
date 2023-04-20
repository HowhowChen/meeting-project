const { body, validationResult } = require('express-validator')

const userValidations = [
  body('name').trim().not().isEmpty().withMessage("User can't empty"),
  body('account').trim().not().isEmpty().withMessage("Account can't empty"),
  body('organization').trim().not().isEmpty().withMessage("Organization can't empty"),
  body('group').trim().not().isEmpty().withMessage("Group can't empty"),
  body('role').trim().not().isEmpty().withMessage("Role can't empty")
]

module.exports = {
  addUserValidator: async (req, res, next) => {
    const { name, account, organization, group, role } = req.body
    //  平行執行註冊驗證
    await Promise.all(userValidations.map(registerValidation => (
      registerValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/userNew', {
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
    await Promise.all(userValidations.map(registerValidation => (
      registerValidation.run(req)
    )))
    //  驗證結果
    const errors = validationResult(req)
    //  結果有錯
    if (!errors.isEmpty()) {
      return res.status(422).render('admin/userEdit', {
        errors: errors.array(),
        user
      })
    }

    next()
  }
}
