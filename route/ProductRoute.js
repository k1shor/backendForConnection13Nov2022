const express = require('express')
const { addProduct, getAllProducts, findProduct, updateProduct, deleteProduct, findProductByCategory } = require('../controller/ProductController')
const upload = require('../utils/fileUpload')
const { productValidation, validation } = require('../validator/validationSchema')
const router = express.Router()

router.post('/addproduct',upload.single('product_image'), productValidation, validation,addProduct)
router.get('/getallproducts', getAllProducts)
router.get('/findproduct/:product_id', findProduct)
router.put('/updateproduct/:id', updateProduct)
router.delete('/deleteproduct/:id', deleteProduct)
router.get('/findproductbycategory/:category_id', findProductByCategory)

module.exports = router