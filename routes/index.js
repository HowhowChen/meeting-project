const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const meetingController = require('../controllers/meeting-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.get('/users/login', userController.loginPage)
router.post('/users/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true }), userController.login)
router.get('/users/logout', userController.logout)

router.get('/meetings/5th', authenticated, meetingController.getFivePage)
router.get('/meetings/6th', authenticated, meetingController.getSixPage)

router.get('/', (req, res) => res.redirect('/users/login'))

module.exports = router
