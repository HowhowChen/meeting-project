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
router.put('/platforms/:id', adminController.putPlatform)
router.delete('/platforms/:id', adminController.deletePlatform)
router.post('/platforms', adminController.postPlatform)
router.get('/platforms', adminController.getPlatforms)

router.get('/countries/:id', adminController.getCountries)
router.put('/countries/:id', adminController.putCountry)
router.delete('/countries/:id', adminController.deleteCountry)
router.post('/countries', adminController.postCountry)
router.get('/countries', adminController.getCountries)

module.exports = router
