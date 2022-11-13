const express = require('express')
const { addCategory, getAllCategories, findCategory, updateCategory, deleteCategory } = require('../controller/CategoryController')
const { requiresignin } = require('../controller/UserController')
const { categoryValidation, validation } = require('../validator/validationSchema')
const router = express.Router()

router.post('/addCategory',categoryValidation, validation, requiresignin,addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/findcategory/:id', findCategory)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

module.exports = router