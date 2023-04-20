const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/users/:id/edit', adminController.editUser)
router.put('/users/:id', adminController.putUser)
router.patch('/users/:id/reset', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.post('/users', adminController.postUser)
router.get('/users/new', adminController.getUserPage)

module.exports = router
