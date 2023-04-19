const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const meetingController = require('../controllers/meeting-controller')
const { authenticated, authenticatedAdmin, authenticatedFiveClass, authenticatedSixClass } = require('../middleware/auth')

router.use('/admin', authenticatedAdmin, admin)

router.get('/users/login', userController.loginPage)
router.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
router.get('/users/logout', userController.logout)

router.get('/meetings/5th', authenticated, authenticatedFiveClass, meetingController.getFivePage)
router.get('/meetings/6th', authenticated, authenticatedSixClass, meetingController.getSixPage)
router.get('/meetings', authenticated, meetingController.getGroupPage)

router.get('/', (req, res) => res.redirect('/meetings'))

module.exports = router
