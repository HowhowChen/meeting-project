const { body, validationResult } = require('express-validator')
const { getUser } = require('../helpers/auth-helpers')
const { Country, Category, Platform } = require('../database/models')

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

const sevenMeetingValidations = [
  body('name').trim().not().isEmpty().withMessage('主旨不可空白'),
  body('country').trim().not().isEmpty().withMessage('國別不可空白'),
  body('category').trim().not().isEmpty().withMessage('會議類型不可空白'),
  body('platform').trim().not().isEmpty().withMessage('會議平台不可空白'),
  body('link').trim().not().isEmpty().withMessage('會議連結不可空白'),
  body('password').trim().not().isEmpty().withMessage('會議ID/密碼不可空白'),
  body('meetingDate').trim().not().isEmpty().withMessage('會議日期不可空白'),
  body('acceptanceDate').trim().not().isEmpty().withMessage('來料日期不可空白'),
  body('uuid').trim().not().isEmpty().withMessage('報號/來源不可空白')
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
  },
  postSevenMeetingValidator: async (req, res, next) => {
    const meeting = req.body

    //  平行執行會議表單驗證
    await Promise.all(sevenMeetingValidations.map(sevenMeetingValidation => (
      sevenMeetingValidation.run(req)
    )))
    // 驗證結果
    const errors = validationResult(req)
    // 結果有錯
    if (!errors.isEmpty()) {
      const [countries, categories, platforms] = await Promise.all([
        Country.findAll({ raw: true }),
        Category.findAll({ raw: true }),
        Platform.findAll({ raw: true })
      ])

      res.locals.layout = 'meeting-new.hbs'
      return res.status(422).render('seven-meeting-new', {
        errors: errors.array(),
        meeting,
        countries,
        categories,
        platforms
      })
    }

    next()
  }
}
