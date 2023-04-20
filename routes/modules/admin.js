const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)
router.get('/users/:id/edit', adminController.editUser)
router.patch('/users/:id/reset', adminController.patchUser)

module.exports = router
