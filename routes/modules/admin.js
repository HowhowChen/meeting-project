const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { addUserValidator, editUserValidator } = require('../../middleware/validator-handler')

router.get('/users/:id/edit', adminController.editUser)
router.put('/users/:id', editUserValidator, adminController.putUser)
router.patch('/users/:id', adminController.patchUser)
router.delete('/users/:id', adminController.deleteUser)
router.get('/users', adminController.getUsers)
router.post('/users', addUserValidator, adminController.postUser)
router.get('/users/new', adminController.getUserPage)

router.get('/categories/:id', adminController.getCategories)
router.put('/categories/:id', adminController.putCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.post('/categories', adminController.postCategory)
router.get('/categories', adminController.getCategories)

router.get('/platforms/:id', adminController.getPlatforms)
router.get('/platforms', adminController.getPlatforms)

module.exports = router
