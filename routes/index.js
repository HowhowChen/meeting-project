const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const meetingController = require('../controllers/meeting-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedFiveClass, authenticatedSixClass, authenticatedUser } = require('../middleware/auth')
const { putUserValidator } = require('../middleware/validator-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/users/login', userController.loginPage)
router.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
router.get('/users/logout', userController.logout)
router.get('/users/:id/edit', authenticatedUser, userController.editUser)
router.put('/users/:id', authenticatedUser, putUserValidator, userController.putUser)

router.get('/meetings/files/:fileDate/:fileName', authenticated, meetingController.getFileContent)
router.post('/meetings/value/:id', authenticated, meetingController.postValue)
router.delete('/meetings/value/:id', authenticated, meetingController.deleteValue)
router.get('/meetings/5th/report', authenticated, authenticatedFiveClass, meetingController.getFiveReport)
router.get('/meetings/5th', authenticated, authenticatedFiveClass, meetingController.getFivePage)
router.get('/meetings/6th', authenticated, authenticatedSixClass, meetingController.getSixPage)
router.get('/meetings', authenticated, meetingController.getGroupPage)

router.get('/', (req, res) => res.redirect('/meetings'))

//  get a 404 page
router.use('*', (req, res) => {
  res.locals.layout = 'error.hbs'
  res.status(404).render('error/404')
})

// error handler
router.use('/', generalErrorHandler)

module.exports = router
